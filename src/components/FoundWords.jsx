import {Modal , Button} from "@mantine/core"

function FoundWords({wordsVisible , setWordsVisible, foundWords}){
     console.log('FoundWords - wordsVisible:', wordsVisible, 'foundWords length:', foundWords.length)
    return(
        
        <Modal zIndex={1000} opened={wordsVisible} onClose={()=>setWordsVisible(false)} title={`You have found ${foundWords.length} words`} styles={{
            content: {backgroundColor: 'black' , color: 'white'} , body: {backgroundColor: 'black' , color: 'white'} , header: {backgroundColor: 'black' , color: 'white'}
        }}>
            <ul>
                {foundWords.map(w=> (
                    <li key={w.word}>{w.word}{w.is_pangram === 1 ? '✨' : ''}</li>
                ))}
            </ul>
        </Modal>
    )
}

export default FoundWords;