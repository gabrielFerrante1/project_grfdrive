import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
} from '@chakra-ui/react'
import { Avatar } from 'antd';
import { signOut, useSession } from 'next-auth/react';

function stringToColor(string: string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
}
 
const User = () => {
    const { data } = useSession()

    return (
        <div>
            <Menu>
                <MenuButton as={Avatar} style={{ backgroundColor: stringToColor('d'), verticalAlign: 'middle', cursor: 'pointer' }} size="large" >
                    {data?.user.name[0].toUpperCase()}
                </MenuButton>
                <MenuList>
                    <MenuItem onClick={signOut}>Sair</MenuItem>
                </MenuList>
            </Menu>
        </div>
    )
}

export default User