export function setUserId(setId:Function) {
    window.ya && window.ya(96713796, 'getClientID', function (clientID: number) {setId(clientID)})
}

export function getUserInfo(id:any, setUser:Function) {
    let link = 'https://rk.geosamara.ru/geosamara-demo-services/1.0.0/contact?metricID='
    link = link + id
    link = link.replace('@', "%")
    fetch(link)
        .then(response => response.json())
        .then(data => setUser(data));
}

export function sendMetricContacts(clientID:number, input: string) {
    let link = 'https://rk.geosamara.ru/geosamara-demo-services/1.0.0/contact?metricID='
    link = link + clientID + '&contact=' + input
    link = link.replace('@', "%")
    fetch(link, { method: 'POST', mode: "no-cors" })
        .then(r => {
            // console.log('Отправлено sendMetricContacts');
        })
}

export function sendMetricAction(clientID:number, action: string, info: string) {
    let link = 'https://rk.geosamara.ru/geosamara-demo-services/1.0.0/action?metricID='
    link = link + clientID + '&module=CadasterIZHS&type='+action+'&options[info]='+info
    fetch(link, { method: 'POST', mode: "no-cors" })
        .then(r => {
            console.log('Отправлено sendMetricAction ', action);
        })
}



