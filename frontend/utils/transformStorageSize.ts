export const StorageSize = (size: number) => {
    let message = `${size} KB`

    if (size >= 1024) {
        let new_size_mb = Math.round(size / 1024)
        message = `${new_size_mb} MB`

        if (new_size_mb >= 1024) {
            let new_size_gb = Math.round(new_size_mb / 1024)
            message = `${new_size_gb} GB`
        }
    }

   return message
}