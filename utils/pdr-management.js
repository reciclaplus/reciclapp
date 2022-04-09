export function pdrExists(barrio, id, listofpdr) {
    if (listofpdr.filter( pdr => pdr.barrio == barrio && pdr.id == id).length > 0) {
        return true
    }
    else {
        return false
    }
    
}

export function getActivePdr(pdr) {
    const a = pdr.filter(activeFilter)

    function activeFilter(e){
            
            if (Boolean(e.active) == true){
                return e   
        }
    }
    return a
}