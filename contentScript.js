document.addEventListener("hello", function(event) {
    document.dispatchEvent(new CustomEvent("hide", {
        detail: { name: "hide" }
    }));
});

document.addEventListener("itemQuery", (event) => {
    let query = event.detail[0]
    let uid = event.detail[1]
    let itemType = query.query.filters.type_filters.filters.category.option
    let itemTypeSplited = itemType.split(".")[1]

    chrome.runtime.sendMessage(
        {"query": query}
    ).then( r => {
        document.dispatchEvent(new CustomEvent("GetItemPrice", {
            detail: r
        }))
    })
})
