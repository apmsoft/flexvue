const fn = (name) => `####${name}<<<<`;


// 함수를 사용
export const _template  = (resp) => `

<h3 class="mt-4 text-red-800"><함수형 템플릿></h3>
<p>${fn(resp.name)}</p>
<p>${resp.age}</p>
<ul>
${resp.msg.map(item =>`
    <li>${item.name}</li>
`).join('')}
</ul>
<br /><br />
`;

// 스트링을 사용
export const _testtpl = `
<h3 class="mt-4 text-blue-800"> <스트링 템플릿> </h3>
name : \${name}
age : \${age}

\${msg.map(item =>\`
    <div>\${item.name}</div>
\`).join('')}
`;