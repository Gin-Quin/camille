<script lang="ts">
    import { PUBLIC_API_URL } from "$env/static/public";
    let currentDate = new Date("2025-03-30");
    let moods: Record<string, number> = {};

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
        // Interpolation de couleur entre rouge (0) et vert (100)
        const red = Math.round(255 * (1 - mood / 100));
        const green = Math.round(255 * (mood / 100));
        return `rgba(${red}, ${green}, 100, 0.3)`;
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
            return {
                day: i + 1,
                date: formatDate(date),
                mood: moods[formatDate(date)],
            };
        },
    );

    // Récupération des moods depuis l'API
    async function fetchMoods() {
        try {
            const response = await fetch(`${PUBLIC_API_URL}/api-mood/moods`);
            const data = await response.json();
            moods = data.moods;
        } catch (error) {
            console.error("Erreur lors de la récupération des moods:", error);
        }
    }

    // Appel initial
    fetchMoods();
</script>

<section class="analysis">
    <h1 class="page-title">Mon Moodrier</h1>
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
                <div>Lun</div>
                <div>Mar</div>
                <div>Mer</div>
                <div>Jeu</div>
                <div>Ven</div>
                <div>Sam</div>
                <div>Dim</div>
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
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2rem;
    }

    .calendar-container {
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(20px);
        border-radius: 30px;
        padding: 2rem;
        width: 400px;
        box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.2),
            inset 0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 0 32px rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
    }

    .calendar {
        width: 100%;
    }

    .calendar-header {
        text-align: center;
        margin-bottom: 2rem;
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
        padding: 0 0.25rem;

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
        gap: 0.5rem;
        padding: 0.25rem;

        .day {
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            color: #000;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);

            &::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(
                    135deg,
                    rgba(255, 255, 255, 0.1) 0%,
                    rgba(255, 255, 255, 0) 100%
                );
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            &.empty {
                background: transparent;
                box-shadow: none;
            }
        }
    }

    .page-title {
        color: #000;
        font-size: 40px;
        font-weight: 400;
    }
</style>
