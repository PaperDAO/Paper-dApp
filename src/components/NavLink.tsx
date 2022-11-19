import { Link, useColorModeValue } from '@chakra-ui/react';
export type TNavLink = {
    label: string;
    link: string;
    isVisible: boolean;
};

const NavLink = ({ label, link, isVisible }: TNavLink): JSX.Element => {
    if (isVisible)
        return (
            <Link
                px={2}
                py={1}
                rounded={'md'}
                _hover={{
                    textDecoration: 'none',
                    bg: useColorModeValue('gray.200', 'gray.700'),
                }}
                href={link}
            >
                {label}
            </Link>
        );
    return <></>;
};

export default NavLink;
