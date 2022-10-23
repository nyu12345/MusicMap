import { useState, useEffect } from 'react'; 

function getRoadtrips() {
    const [roadtrips, setRoadtrips] = useState({}); 

    useEffect(() => {
        fetch('/home')
        .then(res => res.json())
        .then(roadtrips => setRoadtrips(roadtrips))
    })

    return roadtrips; 
}

data = getRoadtrips(); 
console.log(data); 