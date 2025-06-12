// import { cookies } from 'next/headers'
import Menu from './Menu'

async function Navigate() {
    // const token = (await cookies()).get("token")?.value
    // console.log("token: ", token)
    return (
        <Menu />
    )
}

export default Navigate
