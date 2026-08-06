const menu = document.querySelector('#mobile-menu');
const menuLink = document.querySelector('.nav-menu');
const navLogo = document.querySelector('#navbar__logo');

//this code is for the mobile version animation of dropdown function
// Display Mobile Menu

menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLink.classList.toggle('active');
})
window.onload = () => {

    document.getElementById('submit').addEventListener('click', (e) => {
        e.preventDefault();
        let name = document.getElementById('name').value;
        let email = document.getElementById('email').value;
        re_name = /[a-zA-Z_\s\-]{3,32}/
        re_email = /([a-zA-Z_\.\-\d]+)@([a-zA-Z_\.\-\d]+)\.([a-zA-Z]{2,10})/

        if ((!re_name.test(name)) || (!re_email.test(email))) {
            alert('wrong try again')
            location.onload();
        }
        const url = "https://mudfoot.doc.stu.mmu.ac.uk/node/api/mailinglist";

        const data = {
            "name": name,
            "email": email
        };

        console.table(data);

        fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 400) {
                    throw 'bad data sent to the server';
                } else {
                    throw "something went wrong";
                }
            })
            .then(obj => {
                document.getElementById("message").innerHTML = obj.data.name + ' has been added'
            })
            .catch(err => {
                document.getElementById("message").innerHTML = err
            })
    })
}

const gethalloffame = () => {
    const url = "https://mudfoot.doc.stu.mmu.ac.uk/node/api/halloffame";



    fetch(url, {
            method: "get",
        })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw "something went wrong";
            }
        })
        .then((resJson) => {
            let = tableHTML = "";

            for (let i = 0; i < resJson.length; i++) {
                tableHTML += "<tr>";
                tableHTML += "<td>" + resJson[i]["movie_id"] + "</td>";
                tableHTML += "<td>" + resJson[i]["movie_name"] + "</td>";
                tableHTML += "<td>" + resJson[i]["movie_year"] + "</td>";
                tableHTML += "<td>" + resJson[i]["movie_director"] + "</td>";
                tableHTML += "</tr>";
            };

            document.getElementById("movie-table-body").innerHTML = tableHTML;
        })
        .catch((error) => {
            alert(error);
        })

}