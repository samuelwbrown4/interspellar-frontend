import { useState, useEffect } from 'react';
import { Input, Button, Image, Checkbox } from '@mantine/core';
import { useNavigate } from 'react-router'
import interspellarLogo from '/interspellar-logo-3.png'
import '../styles/puzzle.css'
import { notifications } from '@mantine/notifications';

function SignIn({ setUserId }) {
    const API_URL = import.meta.env.VITE_API_URL

    const navigate = useNavigate()

    useEffect(() => {
        const userId = localStorage.getItem('user');
        if (userId) {
            return navigate('/puzzle')
        }
    }, [])



    const [email, setEmail] = useState('')
    const [checked, setChecked] = useState(false)

    async function validateEmail(e) {
        e.preventDefault()
        try {
            if(email === ''){
                return notifications.show({
                    title: 'Invalid email/username!',
                    message: 'Please try again.'
                })
            }
            let response = await fetch(`${API_URL}/api/users/sign-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email , 
                    newUser: checked
                 })
            });

            let result = await response.json()

            if (response.status === 200 && result.id) {
                setUserId(result.id)
                navigate('/puzzle')
            }
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <div style={{ display: 'flex', justifyContent: 'center', alginItems: 'center', height: '100vH' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '80%', justifyContent: 'center' }}>
                <Image src={interspellarLogo} w={'90%'} h={'auto'} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', backgroundColor: '#56525280', borderRadius: '16px', padding: '1rem', border: '1px solid #888686', width: '70%' }}>
                    <h2 style={{ margin: '0' }}>Sign In</h2>
                    <form onSubmit={(e)=>validateEmail(e)}>
                    <Input styles={{ input: { backgroundColor: '#4a4949', borderColor: 'white', width: '100%' }, wrapper: { borderColor: 'white', width: '90%' } }} placeholder='Enter Email or User' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <div style={{ display: 'flex', gap: '1rem' , alignItems: 'center' }}>
                        <h3>New Player? </h3>
                        <Checkbox color='grape' checked={checked} onChange={(e) => setChecked(e.currentTarget.checked)} />
                    </div>
                    <Button size='xl' color='grape' type={'submit'} >Blast Off!  🚀</Button>
                    </form>
                </div>



            </div>

        </div>
    )
}

export default SignIn;