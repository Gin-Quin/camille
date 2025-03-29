<script lang="ts">
</script>

<section class="chatbot">
    <div class="chat-container">
        <p class="catchline">Commence à parler, je suis là pour toi</p>
        <div class="messages-container">
            <ul class="messages">
                <li class="message user-message">
                    <p class="content">Coucou</p>
                </li>
                <li class="message bot-message">
                    <p class="content">Yo !</p>
                </li>
                <li class="message user-message">
                    <p class="content">Ça dit quoi ?</p>
                </li>
                <li class="message bot-message">
                    <p class="content">Ça dit feur</p>
                </li>
            </ul>
        </div>
        <div class="vocal">
            <button class="open-mic" aria-label="Ouvre le micro">
                <i class="fa-solid fa-microphone"></i>
            </button>
        </div>
    </div>
    <div class="write">
        <button class="open-keyboard" aria-label="Ouvre le clavier">
            <i class="fa-solid fa-keyboard"></i>
        </button>
    </div>
</section>

<style>
    .chatbot {
        height: 100dvh;
        width: 100dvw;
        display: flex;
        flex-direction: column;

        .chat-container {
            display: flex;
            flex-direction: column;
            padding: 20px;
            height: 100%;
            width: auto;
            background: rgba(255, 255, 255, 0.45);
            -webkit-backdrop-filter: blur(8px);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.225);

            .catchline {
                font-size: 40px;
            }

            .messages-container {
                display: flex;
                flex-direction: column;
                overflow-y: auto;
                height: 100%;
                width: 100%;
                margin-top: 20px;

                .messages {
                    list-style-type: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;

                    .message {
                        padding: 10px;
                        margin: 5px 0;
                        max-width: 80%;
                    }

                    .user-message {
                        background-color: #ffffff8e;
                        border-radius: 12px 12px 0px 12px;
                        align-self: flex-end;
                        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                    }

                    .bot-message {
                        background-color: #ffffff;
                        border-radius: 12px 12px 12px 0px;
                        align-self: flex-start;
                        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                    }

                    .content {
                        font-size: 16px;
                    }
                }
            }

            .vocal {
                display: flex;
                justify-content: center;
                align-items: center;

                .open-mic {
                    background-color: #ffffff;
                    border-radius: 50%;
                    width: 68px;
                    height: 68px;
                    padding: 10px;
                    border: none;
                    cursor: pointer;
                    font-size: 24px;
                    color: black;
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                }
            }
        }

        .write {
            display: flex;
            justify-content: center;
            align-items: center;

            .open-keyboard {
                background-color: #ffffff;
                border-radius: 12px 12px 0px 0px;
                width: 100%;
                padding: 10px;
                border: none;
                cursor: pointer;
                font-size: 24px;
                color: black;
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            }
        }
    }
</style>
