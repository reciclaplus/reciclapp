export function pdrExists(barrio, id, listofpdr) {
    if (listofpdr.filter( pdr => pdr.barrio == barrio && pdr.id == id).length > 0) {
        return true
    }
    else {
        return false
    }
    
}