url = "https://www.pathofexile.com/api/trade/search/Necropolis"

const tradeSearchApi = (resultLine, resultId) => {
    const fetchItemURL = "https://www.pathofexile.com/api/trade/fetch/"+resultLine+"?query="+resultId

    return fetch(fetchItemURL, {
        method: "GET",
    }).then(response => {
         return response.json().then(r => {
            let amount = r.result[0].listing.price.amount
            let currency = r.result[0].listing.price.currency
            let result = {"amount": amount, "currency":currency}

            return result
        })
    })
}

const parsePrice = (req) => {
    return fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.query)
    }).then(response => {
        return response.json().then(r => {
            console.log('id', r.id)
            console.log('result', r.result[0]);
            return tradeSearchApi(r.result[0], r.id).then( r1 => {
                console.log(r1)
                return tradeSearchApi(r.result[1], r.id).then((r2)=> {
                    console.log(r2)
                    return tradeSearchApi(r.result[2], r.id).then((r3)=> {
                        console.log(r3)
                        return [r.id, [r1,r2,r3]]
                    })
                })
            })
        })
    }).catch(e => {
        console.log(e)
        return e
    })
}


chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {

    parsePrice(req).then(r => {
        console.log("result!~!", r)
        sendResponse(r)
    }).catch(e => {
        console.log(e)
        sendResponse(e)
    })

    return true

})