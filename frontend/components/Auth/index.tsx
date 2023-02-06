import styles from './Auth.module.scss'
import { Input, useToast } from '@chakra-ui/react'
import { Button } from 'antd';
import { useState, ChangeEvent } from 'react' 
import { signIn } from 'next-auth/react'; 
import { useRouter } from 'next/router';


const Auth = () => { 
    const router = useRouter()
    const toast = useToast()

    const [inputEmail, setInputEmail] = useState('')
    const [inputPassword, setInputPassword] = useState('')

    const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => setInputEmail(e.target.value)
    const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => setInputPassword(e.target.value)

    const handleLogin = async () => {
        const request = await signIn('credentials', {
            redirect: false,
            email: inputEmail,
            password: inputPassword
        })

        if (request?.error) {
            toast({
                title: 'Email e/ou senha incorretos',
                status: 'error',
                isClosable: true,
                position: 'bottom-left',
                duration: 9000,
            })
            return;
        }

        toast({
            title: 'Autenticado com sucesso',
            status: 'success',
            isClosable: true,
            position: 'bottom-left',
            duration: 9000,
        })

        const searchParams = new URL(window.location.href)
        const redirect = searchParams.searchParams.get('redirect')
        if (redirect != null) {
            router.push(redirect)
        }
    }

    return (
        <div id={styles.auth}>
            <section className={styles.card}>
                <header>
                    <span className={styles.cardTitle}>Autenticação</span>
                </header>

                <div>
                    <div>
                        <Input
                            value={inputEmail}
                            onChange={handleChangeEmail}
                            placeholder='Email'
                            borderColor='blue.300'
                        />
                    </div>

                    <div className='mt-4'>
                        <Input
                            value={inputPassword}
                            onChange={handleChangePassword}
                            placeholder='Senha'
                            borderColor='blue.300'
                        />
                    </div>
                </div>

                <footer>
                    <Button
                        type='dashed'
                        onClick={handleLogin}
                    >
                        Login
                    </Button>
                </footer>
            </section>
        </div>
    )
}

export default Auth