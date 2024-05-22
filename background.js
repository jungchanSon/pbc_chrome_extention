url = "https://www.pathofexile.com/api/trade/search/Necropolis"

const tradeSearchApi = (resultLine, resultId) => {
    const fetchItemURL = "https://www.pathofexile.com/api/trade/fetch/"+resultLine+"?query="+resultId

    return fetch(fetchItemURL, {
        method: "GET",
    }).then(response => {
         return response.json().then(r => {
             console.log(r)
            let amount = r.result[0].listing.price.amount
            let currency = r.result[0].listing.price.currency
            let result = {"amount": amount, "currency":currency}

            return result
        })
    })
}

const parsePrice = async (req) => {
    const result = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.query)
    }).then(async response => {
        return await response.json().then(async r => {
            console.log('id', r.id)
            console.log('result', r.result[0]);
            let cnt = 0
            let priceList = []
            for (let line of r.result) {
                if (cnt++ >= 3) {
                    break
                }
                console.log('line', line)

                await tradeSearchApi(line, r.id).then((price) => {
                    priceList.push(price)
                })
            }
            console.log("priceList", priceList)
            if (priceList.length > 0)
                return [r.id, priceList]
        })
    }).catch(e => {
        console.log(e)
        return e
    })

    return result
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