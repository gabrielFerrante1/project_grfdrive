import styles from './Loading.module.scss' 
import { Spin } from 'antd';

export const Loading = () => {
    return (
        <div className={styles.container}>
            <Spin
                size="large"
            />
        </div>
    )
}