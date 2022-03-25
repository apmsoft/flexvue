export const _template  = (resp) => `
<h3>test</h3>
<p>${resp.name}</p>
<p>${resp.age}</p>
    ${
        resp.msg.map(item =>`
    <div>${item.name}</div>
    `).join('')}
`;