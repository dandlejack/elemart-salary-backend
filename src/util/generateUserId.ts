export const generateUserId = (length) => {
    let result = ''
    const charAll = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = length; i > 0; i--) {
        result += charAll[Math.floor(Math.random() * charAll.length)]
    }
    return result
}