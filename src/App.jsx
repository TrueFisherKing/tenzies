import { useState, useEffect, useRef } from "react"
import Die from "./Die"
import Confetti from "react-confetti"

export default function App() {
    const [dice, setDice] = useState(() => generateAllNewDice())
    const [count, setCount] = useState(0)
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    })
    const rollDiceButtonRef = useRef(null)

    const gameWon = dice.every(
        (die) => die.isHeld && die.value === dice[0].value
    )

    function hold(id) {
        setDice((oldDice) =>
            oldDice.map((die) =>
                die.id === id ? { ...die, isHeld: !die.isHeld } : die
            )
        )
    }

    function generateAllNewDice() {
        return new Array(10).fill(0).map((_, i) => ({
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: i,
        }))
    }

    function rollDice() {
        setCount((oldCount) => oldCount + 1)
        if (gameWon) {
            setDice(() => generateAllNewDice())
        } else {
            setDice((oldDice) =>
                oldDice.map((die) =>
                    die.isHeld
                        ? die
                        : { ...die, value: Math.ceil(Math.random() * 6) }
                )
            )
        }
    }

    const diceElements = dice.map((dieObj) => (
        <Die
            key={dieObj.id}
            value={dieObj.value}
            hold={() => hold(dieObj.id)}
            isHeld={dieObj.isHeld}
            aria-label={`Die with value ${dieObj.value}, ${dieObj.isHeld ? "held" : "not held"}`}
        />
    ))

    useEffect(() => {
        gameWon && rollDiceButtonRef.current.focus()
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [gameWon])

    return (
        <main>
            {gameWon && (
                <Confetti width={windowSize.width} height={windowSize.height} />
            )}
            <h1>Dice Game</h1>
            
            <h2>{count > 0 && `You rolled ${count} times.`}</h2>
            <p>
                {gameWon
                    ? `You won! Press the "New Game" button to start again.`
                    : `Roll until all dice show the same number. Click a die to hold it.`}
            </p>
            <div
                className="dice-container"
                role="list"
                aria-label="Dice container"
            >
                {diceElements}
            </div>
            <button
                ref={rollDiceButtonRef}
                className="roll-dice"
                onClick={rollDice}
                aria-label={gameWon ? "Start a new game" : "Roll the dice"}
            >
                {gameWon ? "New Game" : "Roll"}
            </button>
        </main>
    )
}
