import {} from '../../flexvue/plugins/sortable/sortable.js';

const onReady = () =>
{
    document.querySelector('#test').innerHTML =`<table class="sortable">
    <thead>
    <tr>
        <td colspan="3">personal</td>
        <td colspan="5">hardware</td>
        <td colspan="4">software</td>
    </tr>
    <tr>
        <th>job title</th>
        <th>name</th>
        <th>company</th>
        <th>processor</th>
        <th class="no-sort">ram(not sortable)</th>
        <th>graphics card</th>
        <th>screen width</th>
        <th>screen height</th>
        <th>platform</th>
        <th>browser</th>
        <th>browser version</th>
        <th>language</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>Boss</td>
        <td>Stan the Man</td>
        <td>Monsters Inc</td>
        <td>AMD</td>
        <td>2</td>
        <td>Nvidia</td>
        <td>1510</td>
        <td>981</td>
        <td>Win32</td>
        <td>IE</td>
        <td>11</td>
        <td>en-us</td>
    </tr>
    <tr>
        <td>Stevedore</td>
        <td>Bridget Jones</td>
        <td>The Hand</td>
        <td>i7</td>
        <td>8gb</td>
        <td>-</td>
        <td>1530</td>
        <td>1080</td>
        <td>Linux x86_64</td>
        <td>Firefox</td>
        <td>54</td>
        <td>sv-se</td>
    </tr>
    <tr>
        <td>HR</td>
        <td>Bruce Wayne</td>
        <td>League of Shadows</td>
        <td>i5</td>
        <td>-</td>
        <td>GeForce</td>
        <td>1520</td>
        <td>1080</td>
        <td>Linux x86_64</td>
        <td>Opera</td>
        <td>46</td>
        <td>dk</td>
    </tr>
    <tr>
        <td>Programmer</td>
        <td>Bilbo Baggins</td>
        <td>Brotherhood of Evil Mutants</td>
        <td>i3</td>
        <td>4 gigabyte</td>
        <td>-</td>
        <td>130</td>
        <td>1080</td>
        <td>Linux x86_64</td>
        <td>Opera</td>
        <td>46</td>
        <td>en</td>
    </tr>
    </tbody>
    <tfoot></tfoot>
</table>`;
}

// document ready
document.addEventListener("DOMContentLoaded",onReady);