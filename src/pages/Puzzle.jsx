import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Image, Button } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import '../styles/puzzle.css'
import shuffleIcon from '../assets/shuffle.svg'
import signOutIcon from '../assets/sign-out.svg'
import listIcon from '../assets/list-bullets.svg'
import PointsProgress from '../components/PointsProgress'
import FoundWords from '../components/FoundWords'
import WinnerAlert from '../components/WinnerAlert'

function Puzzle({ setUserId, userId }) {

    const API_URL = import.meta.env.VITE_API_URL

    const navigate = useNavigate()

    const [puzzleId, setPuzzleId] = useState(null)
    const [letters, setLetters] = useState([]);
    const [centerLetter, setCenterLetter] = useState('')
    const [word, setWord] = useState('');
    const [score, setScore] = useState(0);
    const [maxPoints, setMaxPoints] = useState(100)
    const [checkpoint1, setCheckpoint1] = useState(20)
    const [checkpoint2, setCheckpoint2] = useState(40)
    const [checkpoint3, setCheckpoint3] = useState(60)
    const [checkpoint4, setCheckpoint4] = useState(80)
    const [checkpoint5, setCheckpoint5] = useState(90)
    const [wordsVisible, setWordsVisible] = useState(false)
    const [foundWords, setFoundWords] = useState([])
    const [rank, setRank] = useState('Earthling')
    const [nextRank , setNextRank] = useState(checkpoint1 - 0)
    const [showWinner, setShowWinner] = useState(false)

    useEffect(() => {
        let userId = localStorage.getItem('user');
        if (!userId) {
            navigate('/')
        } else {
            getPuzzle()

        }
    }, [])

    useEffect(() => {
        if (userId === null) {
            navigate('/')
        }
    }, [userId])

    useEffect(() => {
        if (puzzleId) {
            getUserFoundWords();
        }
    }, [puzzleId]);

    useEffect(() => {
        console.log('letters', letters)
    }, [letters])

    useEffect(() => {
        console.log('puzzleid', puzzleId)
    }, [puzzleId])

    useEffect(() => {
        console.log('post-set-score', score)
        if (score >= checkpoint5) {
            setShowWinner(true)
        }
    }, [score])

    useEffect(() => {
        function handleKeyDown(e) {
            const key = e.key.toLowerCase()
            const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

            if (e.key === 'Enter') {
                submitWord()
                return
            }

            if (e.key === 'Backspace') {
                deleteLetter()
                return
            }

            if (letters.includes(key)) {
                addLetter(key.toUpperCase())
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [word])

    useEffect(() => {
        getCurrentRank(score)
        pointsToNextRank(score)
    }, [score])

    const lettersNoCenter = letters?.filter(l => l !== centerLetter)

    function getCurrentRank(score) {
        switch (true) {
            case score >= checkpoint5:
                return setRank('Extraterrestrial!')
            case score >= checkpoint4:
                return setRank('Celestial')
            case score >= checkpoint3:
                return setRank('Star Voyager')
            case score >= checkpoint2:
                return setRank('Cosmonaut')
            case score >= checkpoint1:
                return setRank('Astronaut')
            default:
                return setRank('Earthling')
        }
    }

    function pointsToNextRank(score){
        switch(true){
            case score >= checkpoint5:
                return 0
            case score >= checkpoint4:
                return setNextRank(checkpoint5 - score)
            case score >= checkpoint3: 
                return setNextRank(checkpoint4 - score)
            case score >= checkpoint2:
                return setNextRank(checkpoint3 - score)
            case score >= checkpoint1: 
                return setNextRank(checkpoint2 - score)
            case score >= 0:
                return setNextRank(checkpoint1 - score)
        }
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function addLetter(letter) {
        if (word.length === 15) return
        setWord(word + letter)
    }

    function deleteLetter() {
        let wordArray = [...word]
        wordArray.pop()
        setWord(wordArray.join(''))
    }

    function scoreWords(words) {
        let total = 0
        for (let word of words) {
            if (word.is_pangram === 1) {
                total += (7 + word.word.length)
            }else if(word.word.length === 4){
                total += 1
            } else{
                total += word.word.length
            }
        }
        console.log('scoreWords called with', words.length, 'words, total:', total)

        setScore(total)
    }

    async function getPuzzle() {
        try {
            let response = await fetch(`${API_URL}/api/puzzles/daily`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            let result = await response.json();

            if (result.puzzle) {
                setPuzzleId(result.puzzle.id)

                setCenterLetter(result.puzzle.center_letter)
                setMaxPoints(result.puzzle.max_points)
                setCheckpoint1(Math.floor(result.puzzle.checkpoint_1))
                setCheckpoint2(Math.floor(result.puzzle.checkpoint_2))
                setCheckpoint3(Math.floor(result.puzzle.checkpoint_3))
                setCheckpoint4(Math.floor(result.puzzle.checkpoint_4))
                setCheckpoint5(Math.floor(result.puzzle.checkpoint_5))

                let lettersArray = [...result.puzzle.letters].filter(l => l !== result.puzzle.center_letter)
                let lettersObjectArray = [{ planet: "url('/jupiter.png')" }, { planet: "url('/venus.png')" }, { planet: "url('/mercury.jpeg')" }, { planet: "url('/mars.png')" }, { planet: "url('/earth.png')" }, { planet: "url('/moon.png')" }]
                for (let i = 0; i < lettersObjectArray.length; i++) {
                    lettersObjectArray[i].letter = lettersArray[i]
                }

                setLetters(lettersObjectArray)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function getUserFoundWords() {
        try {
            if (!puzzleId) return

            let userId = localStorage.getItem('user')
            if (!userId) {
                return
            }
            let response = await fetch(`${API_URL}/api/puzzles/words/${puzzleId}/${userId}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })


            let result = await response.json()

            console.log('found', result)

            scoreWords(result.words)
            setFoundWords(result.words)

        } catch (error) {
            console.log(error)
        }
    }

    async function submitWord() {
        try {
            if(word.length < 4){
                setWord('')
                return notifications.show({
                    title: 'Too short.',
                    withCloseButton: false,
                    radius: 'xl',
                    position: 'top-center',
                    className: 'notification',
                    styles: (theme) => ({
                        title: { color: 'white' }
                    }),
                    withBorder: true
                })
            }
            if (!word.includes(centerLetter.toUpperCase())) {
                setWord('')
                return notifications.show({
                    title: 'Center letter not included',
                    withCloseButton: false,
                    radius: 'xl',
                    position: 'top-center',
                    className: 'notification',
                    styles: (theme) => ({
                        title: { color: 'white' }
                    }),
                    withBorder: true
                })
            }
            let userId = localStorage.getItem('user')
            if (!userId) {
                return
            }
            let payload = {
                userId,
                puzzleId,
                word
            }

            let response = await fetch(`${API_URL}/api/puzzles/words`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ payload })
            })

            let result = await response.json()
            console.log('full result object:', result)
            console.log('submittedWord exists?', !!result.submittedWord)
            console.log('submittedWord value:', result.submittedWord)

            console.log('submission result:', result)

            if (response.status === 200) {
                setWord('')
                notifications.show(
                    {
                        title: result.message,
                        withCloseButton: false,
                        radius: 'xl',
                        position: 'top-center',
                        className: 'notification',
                        styles: (theme) => ({
                            title: { color: 'white' }
                        }),
                        withBorder: true
                    }

                )
                return
            }

            if (result.submittedWord) {
                let points = 0
                if (result.submittedWord.is_pangram === 1) {
                    points += (7 + result.submittedWord.word.length)
                }else if(result.submittedWord.word.length === 4){
                    points ++
                }else{
                    points += result.submittedWord.word.length
                }
                
                console.log('pre-add-points', score)
                setScore(prevScore => prevScore + points)

            }

            setWord('')


        } catch (error) {
            console.log(error)
        }
    }

    async function share() {
        if (navigator.share) {
            await navigator.share({
                title: 'interSPELLar',
                text: `I scored ${score} points on Interspellar! 🚀`,
                url: `${API_URL}/api/users/share?score=${score}`
            })
        }
    }


    return (
        <div className='puzzle-root'>

            <FoundWords wordsVisible={wordsVisible} setWordsVisible={setWordsVisible} foundWords={foundWords} />
            <WinnerAlert showWinner={showWinner} setShowWinner={setShowWinner} rank={rank} score={score} share={share} />


            <div style={{ width: '85%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 , display: 'flex' , alignItems: 'center'}}>
                        {/*<Button onClick={()=>setShowWinner(true)}>test share modal</Button>*/}
                        <span style={{fontSize: '.8rem' , color: 'white'}}><b>To Next:</b> {nextRank}</span>
                    </div>
                    <div style={{ flex: 1, justifyContent: 'center' , display: 'flex' , alignItems: 'center' }}>
                        <span style={{ textAlign: 'center', display: 'block', color: 'white', fontSize: '.8rem' }} ><b>Rank:</b> {rank}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flex: 1, justifyContent: 'flex-end' , alignItems: 'center' }}>
                        <Image src={listIcon} h={24} w={'auto'} onClick={() => { getUserFoundWords(); setWordsVisible(true) }} />
                        <Image src={signOutIcon} h={24} w={'auto'} onClick={() => setUserId(null)} />
                    </div>

                </div>
                <PointsProgress score={score} maxPoints={maxPoints} checkpoints={[checkpoint1, checkpoint2, checkpoint3, checkpoint4, checkpoint5]} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', width: '100vw', justifyContent: 'flex-end' }}>

                    <h2 style={{ margin: '0px', color: 'white' }}>{score}</h2>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem' }}>
                        <div style={{ height: '45px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <h1 style={{ color: 'white', textAlign: 'center', margin: '0px' }}>{word}</h1>
                        </div>
                        <div className='cursor'></div>
                    </div>
                </div>

                {letters && centerLetter && <div id='puzzle-column-container'>
                    <div className='puzzle-column outer'>
                        <div className='outer-letter' onClick={() => addLetter(letters[0].letter.toUpperCase())} style={{ backgroundImage: `${letters[0].planet}` }}>
                            <span style={{ borderRadius: '50%', backgroundColor: '#161515b5', width: '25px', height: '25px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0px 0px 5px 5px #161515b5', color: 'white', fontSize: 'xx-large' }}>{letters[0].letter.toUpperCase()}</span>
                        </div>

                        <div className='outer-letter' onClick={() => addLetter(letters[1].letter.toUpperCase())} style={{ backgroundImage: `${letters[1].planet}` }}>
                            <span style={{ borderRadius: '50%', backgroundColor: '#161515b5', width: '25px', height: '25px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0px 0px 5px 5px #161515b5', color: 'white', fontSize: 'xx-large' }}>{letters[1].letter.toUpperCase()}</span>
                        </div>
                    </div>
                    <div className='puzzle-column'>
                        <div className='outer-letter' onClick={() => addLetter(letters[2].letter.toUpperCase())} style={{ backgroundImage: `${letters[2].planet}` }}>
                            <span style={{ borderRadius: '50%', backgroundColor: '#161515b5', width: '25px', height: '25px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0px 0px 5px 5px #161515b5', color: 'white', fontSize: 'xx-large' }}>{letters[2].letter.toUpperCase()}</span>
                        </div>

                        <div className='center-letter' onClick={() => addLetter(centerLetter.toUpperCase())} style={{ backgroundImage: "url('/sun.png')" }}>
                            <span style={{ borderRadius: '50%', backgroundColor: '#161515b5', width: '25px', height: '25px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0px 0px 5px 5px #161515b5', color: 'white', fontSize: 'xx-large' }}>{centerLetter.toUpperCase()}</span>
                        </div>

                        <div className='outer-letter' onClick={() => addLetter(letters[3].letter.toUpperCase())} style={{ backgroundImage: `${letters[3].planet}` }}>
                            <span style={{ borderRadius: '50%', backgroundColor: '#161515b5', width: '25px', height: '25px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0px 0px 5px 5px #161515b5', color: 'white', fontSize: 'xx-large' }}>{letters[3].letter.toUpperCase()}</span>
                        </div>
                    </div>
                    <div className='puzzle-column outer'>
                        <div className='outer-letter' onClick={() => addLetter(letters[4].letter.toUpperCase())} style={{ backgroundImage: `${letters[4].planet}` }}>
                            <span style={{ borderRadius: '50%', backgroundColor: '#161515b5', width: '25px', height: '25px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0px 0px 5px 5px #161515b5', color: 'white', fontSize: 'xx-large' }}>{letters[4].letter.toUpperCase()}</span>
                        </div>

                        <div className='outer-letter' onClick={() => addLetter(letters[5].letter.toUpperCase())} style={{ backgroundImage: `${letters[5].planet}` }}>
                            <span style={{ borderRadius: '50%', backgroundColor: '#161515b5', width: '25px', height: '25px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0px 0px 5px 5px #161515b5', color: 'white', fontSize: 'xx-large' }}>{letters[5].letter.toUpperCase()}</span>
                        </div>
                    </div>
                </div>}
            </div>


            <div id='controls'>
                <Button size='l' color='red' onClick={() => deleteLetter()}>
                    Delete
                </Button>
                <div className='shuffle-btn' >
                    <Image onClick={() => setLetters(shuffle(lettersNoCenter))} style={{ margin: '.5rem' }} src={shuffleIcon} h={24} w={'auto'} />
                </div>

                <Button color='green' onClick={() => submitWord()}>Enter</Button>

            </div>


        </div>
    )
}

export default Puzzle;