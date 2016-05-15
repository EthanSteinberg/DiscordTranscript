import Cookies from 'js-cookie';
import sha256 from 'js-sha256';

const thingy = '17c0ced6fbcd2f24ecae9bbdb49fd20f9e90ca32e389fe3be5aba131a464c929';

export function isLoggedIn() {
    return Cookies.get('password') != null && sha256(Cookies.get('password')) == thingy;
};

export function logIn(password) {
    if (sha256(password) == thingy) {
        Cookies.set('password', password);
        return true;
    }
    return false;
}