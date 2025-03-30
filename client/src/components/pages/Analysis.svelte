<script lang="ts">
    import { PUBLIC_API_URL } from "$env/static/public";
    let currentDate = new Date("2025-03-30");
    let moods: Record<string, number> = {};

    // Données mockées pour mars
    const mockMoods: Record<string, number> = {
        "2025-03-15": 75,
        "2025-03-16": 82,
        "2025-03-17": 45,
        "2025-03-18": 90,
        "2025-03-19": 65,
        "2025-03-20": 88,
        "2025-03-21": 72,
        "2025-03-22": 95,
        "2025-03-23": 60,
        "2025-03-24": 78,
        "2025-03-25": 85,
        "2025-03-26": 40,
        "2025-03-27": 68,
        "2025-03-28": 92,
        "2025-03-29": 70,
        "2025-03-30": 83,
    };

    // Fonction pour obtenir le premier jour du mois (0 = Lundi, 1 = Mardi, etc.)
    function getFirstDayOfMonth(date: Date) {
        const firstDay = new Date(
            date.getFullYear(),
            date.getMonth(),
            1,
        ).getDay();
        // Convertir de 0-6 (Dim-Sam) à 0-6 (Lun-Dim)
        return firstDay === 0 ? 6 : firstDay - 1;
    }

    // Fonction pour obtenir le nombre de jours dans le mois
    function getDaysInMonth(date: Date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    }

    // Fonction pour formater la date en YYYY-MM-DD
    function formatDate(date: Date): string {
        return date.toISOString().split("T")[0];
    }

    // Fonction pour obtenir la couleur en fonction du mood
    function getMoodColor(mood: number | undefined): string {
        if (mood === undefined) return "transparent";

        // Attribution des couleurs selon les plages d'humeur
        if (mood >= 75) return "rgba(76, 175, 80, 0.6)"; // Vert
        if (mood >= 50) return "rgba(255, 193, 7, 0.6)"; // Jaune ambré
        if (mood >= 25) return "rgba(255, 152, 0, 0.6)"; // Orange
        return "rgba(244, 67, 54, 0.6)"; // Rouge
    }

    // Création du tableau des jours pour l'affichage
    $: daysArray = Array.from(
        { length: getDaysInMonth(currentDate) },
        (_, i) => {
            const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                i + 1,
            );
            const dateStr = formatDate(date);
            return {
                day: i + 1,
                date: dateStr,
                mood: moods[dateStr] || mockMoods[dateStr],
            };
        },
    );

    // Récupération des moods depuis l'API
    async function fetchMoods() {
        try {
            const response = await fetch(`${PUBLIC_API_URL}/api-mood/moods`);
            const data = await response.json();
            // Combine les données de l'API avec les données mockées
            moods = { ...mockMoods, ...data.moods };
        } catch (error) {
            console.error("Erreur lors de la récupération des moods:", error);
            // En cas d'erreur, utilise uniquement les données mockées
            moods = mockMoods;
        }
    }

    // Appel initial
    fetchMoods();
</script>

<section class="analysis">
    <h1 class="page-title">Mood Tracker</h1>
    <div class="calendar-container">
        <div class="calendar">
            <div class="calendar-header">
                <h2>
                    {currentDate.toLocaleDateString("fr-FR", {
                        month: "long",
                        year: "numeric",
                    })}
                </h2>
            </div>
            <div class="weekdays">
                <div>L</div>
                <div>M</div>
                <div>M</div>
                <div>J</div>
                <div>V</div>
                <div>S</div>
                <div>D</div>
            </div>
            <div class="days">
                {#each Array(getFirstDayOfMonth(currentDate)) as _, i}
                    <div class="day empty"></div>
                {/each}
                {#each daysArray as { day, date, mood }}
                    <div
                        class="day"
                        style="background-color: {getMoodColor(mood)}"
                    >
                        {day}
                    </div>
                {/each}
            </div>
        </div>
    </div>
</section>

<style lang="scss">
    .analysis {
        padding: 20px;
        min-height: 100vh;
        display: grid;
        grid-template-rows: auto 1fr;
        align-items: start;
        gap: 2rem;
    }

    .page-title {
        text-align: center;
        margin: 0;
        padding-top: 1rem;
    }

    .calendar-container {
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(20px);
        border-radius: 30px;
        padding: 20px;
        width: min(100%, 500px);
        margin: auto;
        align-self: center;
        box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.2),
            inset 0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 0 32px rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .calendar {
        width: 100%;
    }

    .calendar-header {
        padding: 10px;
        text-align: center;
        position: relative;

        h2 {
            text-align: left;
            font-size: 1.5rem;
            color: #000;
            text-transform: capitalize;
            letter-spacing: 1px;
            font-weight: 300;
            text-shadow: none;
        }
    }

    .weekdays {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        text-align: center;
        padding: 10px;

        div {
            color: rgba(0, 0, 0, 0.7);
            font-size: 0.8rem;
            padding: 0.25rem;
            font-weight: 500;
            letter-spacing: 1px;
        }
    }

    .days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 5px;
        padding: 10px;

        .day {
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 50%;
            color: #000;
            font-size: 12px;
            transition: all 0.3s ease;
            position: relative;
            cursor: pointer;

            &.empty {
                background: transparent;
            }

            // Enlève la bordure si le jour a une couleur (mood défini)
            &[style*="background-color"] {
                box-shadow: none;
            }

            // Ajoute la bordure seulement pour les jours sans mood
            &:not([style*="background-color"]):not(.empty) {
                box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
            }
        }
    }

    .page-title {
        color: #000;
        font-size: 40px;
        font-weight: 400;
    }
</style>
