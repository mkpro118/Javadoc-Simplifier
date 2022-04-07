const url_container = $('div[data-urls-container]')
const result_container = $('section[data-results]')
const input = $('input[data-input]')
const add_btn = $('button[data-add]')
const generate_btn = $('button[data-generate]')
const pattern = /\/([\w\d]+)\.html/
const api_url = url => `${window.location.origin}/api/${url.replaceAll('/','`')}`

input.on('keyup', e => {
    if (e.key === 'Enter') {
        add_btn.click()
    }
})

add_btn.on('click', event => {
    $('div[data-generate-container] > button').css('opacity', '1')
    event.target.blur()
    const url = input.val()
    if (!url) return
    for(const item of $('a')) {
        if (url.toLowerCase().includes(item.text().toLowerCase())) return
    }
    const container_elem = $('<div>')
    let name
    try {
        name = url.match(pattern)[1]
    }
    catch (e) {
        name = url
    }
    const link_elem = $('<a>', {href: url, title: url}).text(`${name}`)
    link_elem.attr('link', url)
    const button_elem = $('<button>', {title: 'Remove link'}).text('Remove')
    button_elem.on('click', e => {
        if (url_container.get().children.length === 1) {
            generate_btn.css('opacity', '0')
        }
        e.target.parentNode.remove()

    })
    container_elem.append(link_elem).append(button_elem)
    url_container.append(container_elem)
    input.val('')
})

generate_btn.on('click', event => {
    result_container.get().innerHTML = ''
    for(let link of $('[data-link]')) {
        fetch(api_url(link.attr('link')))
        .then(res => res.json())
        .then(data => {
            if (!data.successful) return
            create(data)
        })
    }
})


function create(data) {
    const container = $('<details>')
    const summary = $('<summary>', {title: 'Click to preview'}).text(data.name)
    const pre = $('<pre>')
    const code = $('<code>').text(data.stub)
    const btn_container = $('<span>')
    const copy_btn = $('<button>').text('Copy')
    const download_btn = $('<button>').text('Download')

    copy_btn.on('click', async e => {
        try {
            if (!navigator.clipboard) {
                throw 'err'
            }
            await navigator.clipboard.writeText(data.stub)
            copy_btn.text('Copied!').css('color', 'hsl(100, 50%, 50%)')
        }
        catch (err) {
            copy_btn.text('Failed!')
        }
        setTimeout(() => {
            copy_btn.text('Copy').css('color', 'hsl(0, 0%, 90%)')
        }, 2500)
    })

    download_btn.on('click', e => {
        download(`${data.name}.java`, data.stub)
    })

    pre.append(code)
    btn_container.append(copy_btn).append(download_btn)
    summary.append(btn_container)
    container.append(summary).append(pre)
    result_container.append(container)
}

function download(filename, text) {
    const element = $('<a>').get()
    element.setAttribute('href', 'data:text/plaincharset=utf-8,' + encodeURIComponent(text))
    console.log(`element.href: ${element.href}`)
    element.setAttribute('download', filename)
    console.log(`element.download: ${element.download}`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
}
