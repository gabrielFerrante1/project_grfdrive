import styles from './Navbar.module.scss'
import Link from 'next/link'
import SearchInput from '../SearchInput'
import User from '../User'
 
export const Navbar = () => {
     
    return (
        <div id={styles.navBar}>
            <Link href={'/'}>
                <div className={styles.logo} ></div>
            </Link>

            <nav>
                <div className={styles.searchInputContent}>
                    <SearchInput />
                </div>

                <div className={styles.userContent}>
                   <User />
                </div>
            </nav>
        </div>
    )
}