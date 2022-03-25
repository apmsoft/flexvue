// 함수를 사용
export const _template  = (resp) => `
<h3><함수형 템플릿></h3>
<p>${resp.name}</p>
<p>${resp.age}</p>
    ${
        resp.msg.map(item =>`
    <div>${item.name}</div>
    `).join('')}
`;

// 스트링을 사용
export const _testtpl = new String(`
<br /><br />
<h3> < String 스트링 템플릿 > </h3>
name : $\{name}
age : $\{age}

$\{
    msg.map(item =>\`
<div>$\{item.name}</div>
\`).join('')}
<br /><br />
`).toString();