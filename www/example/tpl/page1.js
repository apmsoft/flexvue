// class
export default class TplPage1 
{
    constructor(){
    }

    async render(message) { // 비동기
        return await(`
            ${
            [1,2,3,4,5,6,7,8,9,10].map(p => {`
                <p style="padding:100px;">page1 ${p}</p>
            `}).join('<br><br><br><br><br><br><br><br><br><br>')
            }
        `);
    }
}