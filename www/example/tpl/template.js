const fn = (name) => `####${name}<<<<`;

export default class Template {
    async render(message) {
        return await
        (`
            <h3 class="mt-4 text-red-800">1.비동기</h3>
            <p>${fn(message.name)}</p>
            <p>${message.age}</p>
            <ul>
            ${message.msg.map(item =>`
                <li>${item.name}</li>
            `).join('')}
            </ul>
        `);
    }

    render2(message) {
        return (`
            <h3 class="mt-4 text-red-800">2.일반</h3>
            <p>${fn(message.name)}</p>
            <p>${message.age}</p>
            <ul>
            ${message.msg.map(item =>`
                <li>${item.name}</li>
            `).join('')}
            </ul>
        `);
    }
}