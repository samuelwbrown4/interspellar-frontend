import {useState , useEffect} from 'react'
import {Modal , Image} from '@mantine/core'
import shareIcon from '../assets/share-network.svg'

function WinnerAlert({showWinner , setShowWinner , rank , score , share}){
    return (
        <Modal opened={showWinner} onClose={()=>setShowWinner(false)} zIndex={1000} styles={{
            content: {backgroundColor: 'black' , color: 'white'} , body: {backgroundColor: 'black' , color: 'white'} , header: {backgroundColor: 'black' , color: 'white'}
        }}>
            <div style={{display: 'flex' , flexDirection: 'column' , justifyContent: 'center' , alignItems: 'center' , gap: '2rem'}}>
                <h1>Galaxy Brain!</h1>
                <span style={{fontSize: '6rem'}}>👽</span>
                <div style={{display: 'flex' , gap: '1rem' , alignItems: 'center' , border: '1px solid #ccc' , padding: '1rem' , borderRadius: '8px'}} onClick={()=>share()}>
                    <span>Share your score!</span>
                    <Image src={shareIcon} h={24} w={'auto'} />
                </div>
            </div>
            
        </Modal>
    )
}

export default WinnerAlert