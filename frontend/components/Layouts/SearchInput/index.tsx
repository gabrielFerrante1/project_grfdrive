import styles from './SearchInput.module.scss'
import { BiSearchAlt2 } from 'react-icons/bi'
import { MdClose } from 'react-icons/md'
import { ChangeEvent, useState } from 'react'

const SearchInput = () => {
    const [searchInput, setSearchInput] = useState('')

    const handleChangeSearchInput = (e: ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)
    const handleClearSearchInput = () => {
        setSearchInput('')
    }

    return (
        <div>
            <div id={styles.searchInput}>
                <BiSearchAlt2
                    className={searchInput ? styles.clickableIcon : styles.icon}
                />

                <input
                    value={searchInput}
                    onChange={handleChangeSearchInput}
                    placeholder='Pesquisar no Drive'
                    className={styles.input}
                />

                {searchInput &&
                    <MdClose
                        className={styles.clickableIcon}
                        onClick={handleClearSearchInput}
                    />
                }

            </div>
        </div>
    )
}

export default SearchInput