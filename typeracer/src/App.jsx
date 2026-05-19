import { useEffect, useState } from "react"

const WORDS = [
  "react",
  "vibe",
  "javascript",
  "matrix",
  "cyber",
  "speed",
  "pixel",
]

function App() {
  const [words, setWords] = useState([])
  const [input, setInput] = useState("")
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)

  const [gameOver, setGameOver] = useState(false)

  const [gameStarted, setGameStarted] =
    useState(false)

  useEffect(() => {
    if (gameOver || !gameStarted) return

    const spawnInterval = setInterval(() => {
      const randomWord =
        WORDS[
          Math.floor(
            Math.random() * WORDS.length
          )
        ]

      const newWord = {
        text: randomWord,
        y: 0,
        x: Math.random() * 700,
        id: Date.now() + Math.random(),
      }

      setWords((oldWords) => [
        ...oldWords,
        newWord,
      ])
    }, 2000)

    return () => clearInterval(spawnInterval)
  }, [gameOver, gameStarted])

  useEffect(() => {
    if (gameOver || !gameStarted) return

    const moveInterval = setInterval(() => {
      setWords((oldWords) =>
        oldWords
          .map((word) => ({
            ...word,
            y: word.y + 0.8,
          }))
          .filter((word) => {
            if (word.y > 450) {
              setLives(
                (oldLives) => oldLives - 1
              )

              return false
            }

            return true
          })
      )
    }, 16)

    return () => clearInterval(moveInterval)
  }, [gameOver, gameStarted])

  useEffect(() => {
    const matchedWord = words.find(
      (word) => word.text === input
    )

    if (matchedWord) {
      setWords((oldWords) =>
        oldWords.filter(
          (word) => word.id !== matchedWord.id
        )
      )

      setScore((oldScore) => oldScore + 1)

      setInput("")
    }
  }, [input, words])

  useEffect(() => {
    if (lives <= 0) {
      setGameOver(true)
    }
  }, [lives])

  function restartGame() {
    setWords([])
    setScore(0)
    setLives(3)

    setGameOver(false)

    setInput("")

    setGameStarted(false)
  }

  return (
    <div className="game">

      {!gameStarted && (
        <div className="menu">
          <h1>WORD RUSH</h1>

          <p>
            Type the falling words before
            they hit the ground.
          </p>

          <button
            onClick={() =>
              setGameStarted(true)
            }
          >
            START GAME
          </button>
        </div>
      )}

      {gameStarted && (
        <>
          <h1>Type Racer</h1>

          <h2>Score: {score}</h2>

          <h2>Lives: {lives}</h2>

          {gameOver && (
            <div>
              <h1>GAME OVER</h1>

              <button onClick={restartGame}>
                Restart
              </button>
            </div>
          )}

          <input
            type="text"
            value={input}
            disabled={gameOver}
            onChange={(event) =>
              setInput(event.target.value)
            }
            placeholder="Type here..."
          />

          <div className="game-area">
            <div className="background-grid"></div>

            {words.map((word) => (
              <div
                key={word.id}
                className="word"
                style={{
                  top: word.y + "px",
                  left: word.x + "px",
                }}
              >
                {word.text}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default App