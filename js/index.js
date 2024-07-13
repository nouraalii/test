/// <reference types="../@types/jquery"/>

let allMeals = [];
let mealCards = document.getElementById('meal-cards');
let allCategories=[];
let allArea=[];
let allIngradients=[];
let allCategoriesDetails=[];

// ---------------------openWebsiteCards---------------

$(document).ready(
    function() {
    async function getAllMeals() {
    let spinner = document.getElementById('spinner');
    if (spinner) {
        spinner.style.display = 'block';
    } else {
        console.error('Spinner element not found!');
    }

    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
        let data = await response.json();
        allMeals = data.meals;
        console.log(allMeals);
        displayMeals(allMeals);
    } catch (error) {
        console.error('Error fetching meals:', error);
    } finally {
        if (spinner) {
            spinner.style.display = 'none';
        } else {
            console.error('Spinner element not found to hide!');
        }
    }
}


getAllMeals();

function displayMeals(meals) {
    let cartoona = '';
    for (let i = 0; i < meals.length; i++) {
        cartoona += `<div class="col-lg-3 gy-4">
                        <div class="card-meal position-relative overflow-hidden rounded-3" data-id="${meals[i].idMeal}">
                            <img class="w-100" src="${meals[i].strMealThumb}" alt="">
                            <div class="card-meal-layer position-absolute d-flex align-items-center text-black p-2">
                                <h3>${meals[i].strMeal}</h3>
                            </div>
                        </div>
                    </div>`;
    }
    document.querySelector('.meals-row').innerHTML = cartoona;
}

// ----------------------mealsDetails------------------

document.querySelector('.meals-row').addEventListener('click', function (e) {
    const cardMeal = e.target.closest('.card-meal');
    if (cardMeal) {
        const idMeal = cardMeal.getAttribute('data-id');
        document.getElementById('meal-cards').classList.add('d-none');
        document.getElementById('meal-description').classList.remove('d-none');
        getMealsDetails(idMeal);
    }
});

async function getMealsDetails(idMeal) {
    try {
        showSpinner();
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
        let data = await response.json();

        if (data.meals && data.meals.length > 0) {
            let meal = data.meals[0];
            console.log(meal);
            displayMealDetails(meal);
            hideNavMenu();
        }

        hideSpinner();
    } catch (error) {
        console.error('Error fetching meal details:', error);
        hideSpinner();
    }
}



function displayMealDetails(meal) {
    let detailsOfMeals = `
        <div class="row">
            <div class="col-md-4">
                <img src="${meal.strMealThumb}" class="w-100 rounded-3" alt="image details">
                <h3>${meal.strMeal}</h3>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <div class="d-flex flex-wrap g-3">
                    ${meal.strIngredient1 ? `<div class="alert alert-info m-2 p-1">${meal.strIngredient1}</div>` : ''}
                    ${meal.strIngredient2 ? `<div class="alert alert-info m-2 p-1">${meal.strIngredient2}</div>` : ''}
                    ${meal.strIngredient3 ? `<div class="alert alert-info m-2 p-1">${meal.strIngredient3}</div>` : ''}
                    ${meal.strIngredient4 ? `<div class="alert alert-info m-2 p-1">${meal.strIngredient4}</div>` : ''}
                    ${meal.strIngredient5 ? `<div class="alert alert-info m-2 p-1">${meal.strIngredient5}</div>` : ''}
                    ${meal.strIngredient6 ? `<div class="alert alert-info m-2 p-1">${meal.strIngredient6}</div>` : ''}
                    ${meal.strIngredient7 ? `<div class="alert alert-info m-2 p-1">${meal.strIngredient7}</div>` : ''}
                </div>
                <h3>Tags :</h3>
                ${meal.strTags ? `<ul class="list-unstyled d-flex g-3 flex-wrap">
                    <li class="alert alert-danger m-2 p-1">${meal.strTags}</li>
                    </ul>` : ''}
                ${meal.strSource ? `<a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>` : ''}
                ${meal.strYoutube ? `<a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>` : ''}
            </div>
        </div>`;
    document.getElementById('meal-description').innerHTML = detailsOfMeals;
}



// --------------------------sideNav-------------------------


    function showNavMenu() {
        $(".sidebar-menu").animate({
            left: 0
        }, 300); 

        $(".toggle-icon").removeClass("fa-align-justify");
        $(".toggle-icon").addClass("fa-xmark");

        let menuItems = $(".menu-content ul li");
        for (let i = 0; i < menuItems.length; i++) {
            $(menuItems[i]).delay(i * 100).animate({
                top: 0,
                opacity: 1
            }, 300);
        }
    }

    function hideNavMenu() {
        let menuWidth = $(".sidebar-menu .menu-content").outerWidth();
        $(".sidebar-menu").animate({
            left: -menuWidth
        }, 300); 

        $(".toggle-icon").addClass("fa-align-justify");
        $(".toggle-icon").removeClass("fa-xmark");

        let menuItems = $(".menu-content ul li");
        $(menuItems).animate({
            top: 300,
            opacity: 0
        }, 300); 
    }

    hideNavMenu();

    $(".sidebar-menu i.toggle-icon").click(function() {
        if ($(".sidebar-menu").css("left") == "0px") {
            hideNavMenu();
        } else {
            showNavMenu();
        }
    });


    // --------------------------categories---------------------------


    document.getElementById('nav-categories').addEventListener('click', function() {
        getAllCategories();
        document.getElementById('meal-cards').classList.add('d-none');
        document.getElementById('meal-description').classList.add('d-none');
        document.getElementById('categories').classList.remove('d-none');   
    });

    document.getElementById('nav-area').addEventListener('click', function() {
        getAllArea();
        document.getElementById('meal-cards').classList.add('d-none');
        document.getElementById('meal-description').classList.add('d-none');
        document.getElementById('categories').classList.add('d-none');
    });
    
    document.getElementById('nav-ingredients').addEventListener('click', function() {
        document.getElementById('meal-cards').classList.add('d-none');
        document.getElementById('meal-description').classList.add('d-none');
        document.getElementById('categories').classList.add('d-none');
    });
    
    document.getElementById('nav-search').addEventListener('click', function() {
        document.getElementById('meal-cards').classList.add('d-none');
        document.getElementById('meal-description').classList.add('d-none');
        document.getElementById('categories').classList.add('d-none');
    });

    document.getElementById('nav-contact').addEventListener('click', function() {
        document.getElementById('meal-cards').classList.add('d-none');
        document.getElementById('meal-description').classList.add('d-none');
        document.getElementById('categories').classList.add('d-none');
    });

async function getAllCategories() {
    try {
        showSpinner();
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
        let data = await response.json();
        let allCategories = data.categories;
        console.log(allCategories);
        displayCategories(allCategories);
        hideNavMenu();
        
        hideSpinner();
    } catch (error) {
        console.error('Error fetching categories:', error);
        hideSpinner();
    }
}


function displayCategories(allCategories) {
    let cartoona = '';
    allCategories.forEach(category => {
        cartoona += `<div class="col-lg-3 gy-4">
                        <div class="card-meal category position-relative overflow-hidden rounded-3" category-id="${category.strCategory}">
                            <img class="w-100" src="${category.strCategoryThumb}" alt="">
                            <div class="card-meal-layer position-absolute text-center text-black p-2">
                                <h3>${category.strCategory}</h3>
                                <p>${category.strCategoryDescription ? category.strCategoryDescription.split(" ").slice(0, 20).join(" ") : ''}</p>
                            </div>
                        </div>
                    </div>`;
    });
    document.querySelector('.categories-row').innerHTML = cartoona;
}

// --------------------------------categoryDetails---------------------------
document.querySelector('.categories-row').addEventListener('click', function(e) {
    const cardMeal = e.target.closest('.category');
    if (cardMeal) {
        const idMeal = cardMeal.getAttribute('category-id');
        document.getElementById('categories').classList.add('d-none');
        document.getElementById('categories-details').classList.remove('d-none');
        getCategoriesDetails(idMeal);
    }
});

async function getCategoriesDetails(idMeal) {
    try {
        showSpinner();
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${idMeal}`);
        let data = await response.json();
        
        if (data.meals && data.meals.length > 0) {
            console.log(data.meals);
            displayCategoryDetails(data.meals);
            hideNavMenu();
        } else {
            console.log('No meals found for this category.');
            document.querySelector('.categories-details-row').innerHTML = '<p>No meals found for this category.</p>';
        }
        hideSpinner();
    } catch (error) {
        console.error('Error fetching categories details:', error);
        hideSpinner();
    }
}

function displayCategoryDetails(meals) {
    let cartoona = '';
    meals.forEach(meal => {
        cartoona += `<div class="col-lg-3 gy-4">
                        <div class="card-meal category-details position-relative overflow-hidden rounded-3" categoryDetails-id=${meal.idMeal}>
                            <img class="w-100" src="${meal.strMealThumb}" alt="">
                            <div class="card-meal-layer position-absolute d-flex align-items-center text-center text-black p-2">
                                <h3>${meal.strMeal}</h3>
                            </div>
                        </div>
                    </div>`;
    });
    document.querySelector('.categories-details-row').innerHTML = cartoona;
}

// --------------------------------categoryInstruction---------------------------

document.querySelector('.categories-details-row').addEventListener('click', function(e) {
    const cardMeal = e.target.closest('.category-details');
    if (cardMeal) {
        const idMeal = cardMeal.getAttribute('categoryDetails-id');
        document.getElementById('categories-details').classList.add('d-none');
        document.getElementById('meal-description').classList.remove('d-none');
        getMealsDetails(idMeal);
    }
});

// ---------------------------area----------------------------------------


document.getElementById('nav-area').addEventListener('click', function() {
    getAllArea();
    document.getElementById('meal-cards').classList.add('d-none');
    document.getElementById('meal-description').classList.add('d-none');
    document.getElementById('area').classList.remove('d-none');
});

document.getElementById('nav-categories').addEventListener('click', function() {
    getAllCategories();
    document.getElementById('meal-cards').classList.add('d-none');
    document.getElementById('meal-description').classList.add('d-none');
    document.getElementById('area').classList.add('d-none');   
});

document.getElementById('nav-ingredients').addEventListener('click', function() {
    document.getElementById('meal-cards').classList.add('d-none');
    document.getElementById('meal-description').classList.add('d-none');
    document.getElementById('area').classList.add('d-none'); 
});

document.getElementById('nav-search').addEventListener('click', function() {
    document.getElementById('meal-cards').classList.add('d-none');
    document.getElementById('meal-description').classList.add('d-none');
    document.getElementById('area').classList.add('d-none'); 
});

document.getElementById('nav-contact').addEventListener('click', function() {
    document.getElementById('meal-cards').classList.add('d-none');
    document.getElementById('meal-description').classList.add('d-none');
    document.getElementById('area').classList.add('d-none'); 
});

async function getAllArea() {
    try {
        showSpinner();
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
        let data = await response.json();
        let allArea = data.meals;
        console.log(allArea);
        displayArea(allArea);
        hideSpinner();
        hideNavMenu();
    } catch (error) {
        console.error('Error fetching area:', error);
        hideSpinner();
    }
}

function displayArea(allArea) {
    let cartoona = '';
    allArea.forEach(area => {
        cartoona += `<div class="col-md-3 area" area-id=${area.strArea}>
                    <div class="rounded-2 text-center">
                            <i class="fa-solid fa-house-laptop fa-4x"></i>
                            <h3>${area.strArea}</h3>
                    </div>
                </div>`;
    });
    document.querySelector('.area-row').innerHTML = cartoona;
}


// --------------------------------areaDetails---------------------------
document.querySelector('.area-row').addEventListener('click', function(e) {
    const cardMeal = e.target.closest('.area');
    if (cardMeal) {
        const area = cardMeal.getAttribute('area-id');
        document.getElementById('area').classList.add('d-none');
        document.getElementById('area-details').classList.remove('d-none');
        getAreaDetails(area);
    }
});

async function getAreaDetails(area) {
    try {
        showSpinner();
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
        let data = await response.json();
        if (data.meals && data.meals.length > 0) {
            console.log(data.meals);
            displayAreaDetails(data.meals);
            hideNavMenu();
        } else {
            console.log('No meals found for this area.');
            document.querySelector('.area-details-row').innerHTML = '<p>No meals found for this area.</p>';
        }
        hideSpinner();
    } catch (error) {
        console.error('Error fetching area details:', error);
        hideSpinner();
    }
}


function displayAreaDetails(meals) {
    let cartoona = '';
    meals.forEach(meal => {
        cartoona += `<div class="col-lg-3 gy-4">
                        <div class="card-meal area-details position-relative overflow-hidden rounded-3" areaDetails-id=${meal.idMeal}>
                            <img class="w-100" src="${meal.strMealThumb}" alt="">
                            <div class="card-meal-layer position-absolute d-flex align-items-center text-center text-black p-2">
                                <h3>${meal.strMeal}</h3>
                            </div>
                        </div>
                    </div>`;
    });
    document.querySelector('.area-details-row').innerHTML = cartoona;
}


// --------------------------------areaInstruction---------------------------

document.querySelector('.area-details-row').addEventListener('click', function(e) {
    const cardMeal = e.target.closest('.area-details');
    if (cardMeal) {
        const idMeal = cardMeal.getAttribute('areaDetails-id');
        document.getElementById('area-details').classList.add('d-none');
        document.getElementById('meal-description').classList.remove('d-none');
        getMealsDetails(idMeal);
    }
});

// ------------------------ingradents---------------------



document.getElementById('nav-ingredients').addEventListener('click', function() {
    getAllIngradients();
    document.getElementById('meal-cards').classList.add('d-none');
    document.getElementById('meal-description').classList.add('d-none');
    document.getElementById('ingradients').classList.remove('d-none');
});

document.getElementById('nav-categories').addEventListener('click', function() {
    getAllCategories();
    document.getElementById('meal-cards').classList.add('d-none');
    document.getElementById('meal-description').classList.add('d-none');
    document.getElementById('ingradients').classList.add('d-none');   
});

document.getElementById('nav-area').addEventListener('click', function() {
    getAllArea();
    document.getElementById('meal-cards').classList.add('d-none');
    document.getElementById('meal-description').classList.add('d-none');
    document.getElementById('ingradients').classList.add('d-none');
});
document.getElementById('nav-search').addEventListener('click', function() {
    getAllArea();
    document.getElementById('meal-cards').classList.add('d-none');
    document.getElementById('meal-description').classList.add('d-none');
    document.getElementById('ingradients').classList.add('d-none');
});
document.getElementById('nav-contact').addEventListener('click', function() {
    getAllArea();
    document.getElementById('meal-cards').classList.add('d-none');
    document.getElementById('meal-description').classList.add('d-none');
    document.getElementById('ingradients').classList.add('d-none');
});


async function getAllIngradients() {
    try {
        showSpinner();
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
        let data = await response.json();
        if (data.meals) {
            let allIngredients = data.meals.slice(0, 20);
            console.log(allIngredients);
            displayIngradients(allIngredients);
            hideNavMenu();
        }
        hideSpinner();
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        hideSpinner();
    }
}
function displayIngradients(allIngradients) {
    let cartoona = '';
    allIngradients.forEach(ingradients => {
        cartoona += `<div class="col-md-3 ingradient" ingradient-id=${ingradients.strIngredient}>
                    <div class="rounded-2 text-center">
                           <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                            <h3>${ingradients.strIngredient}</h3>
                            <p>${ingradients.strDescription ? ingradients.strDescription.split(" ").slice(0, 20).join(" ") : ''}</p>
                    </div>
                </div>`;
    });
    document.querySelector('.ingradients-row').innerHTML = cartoona;
}

// --------------------------ingradientsDetails-------------------
document.querySelector('.ingradients-row').addEventListener('click', function(e) {
    const cardMeal = e.target.closest('.ingradient');
    if (cardMeal) {
        const idMeal = cardMeal.getAttribute('ingradient-id');
        document.getElementById('ingradients').classList.add('d-none');
        document.getElementById('ingradients-details').classList.remove('d-none');
        getIngradientsDetails(idMeal);
    }
});



async function getIngradientsDetails(ingredients) {
    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`);
        let data = await response.json();
        if (data.meals && data.meals.length > 0) {
            console.log(data.meals)
            displayIngradientsDetails(data.meals);
            hideNavMenu();
        } else {
            console.log('No meals found for this category.');
            document.querySelector('.categories-details-row').innerHTML = '<p class="text-white">No meals found for this category.</p>';
        }
    } catch (error) {
        console.error('Error fetching categories details:', error);
    }
}


function displayIngradientsDetails(meals){
    let cartoona = '';
    meals.forEach(meal => {
        cartoona += `<div class="col-lg-3 gy-4">
                        <div class="card-meal ingradients-details position-relative overflow-hidden rounded-3" areaDetails-id=${meal.idMeal}>
                            <img class="w-100" src="${meal.strMealThumb}" alt="">
                            <div class="card-meal-layer position-absolute d-flex align-items-center text-center text-black p-2">
                                <h3>${meal.strMeal}</h3>
                            </div>
                        </div>
                    </div>`;
    });
    document.querySelector('.ingradients-details-row').innerHTML = cartoona;
}



// ------------------------instructionsInstructions------------------

document.querySelector('.ingradients-details-row').addEventListener('click', function(e) {
    const cardMeal = e.target.closest('.ingradients-details');
    if (cardMeal) {
        const idMeal = cardMeal.getAttribute('areaDetails-id');
        document.getElementById('ingradients-details').classList.add('d-none');
        document.getElementById('meal-description').classList.remove('d-none');
        getMealsDetails(idMeal);
    }
});






//---------------------search---------------------------
document.getElementById('nav-search').addEventListener('click', function() {
    displaySearchInputs();
    hideNavMenu();
    document.getElementById('meal-cards').classList.add('d-none');
    document.getElementById('meal-description').classList.add('d-none');
    document.getElementById('search').classList.remove('d-none');
});
document.getElementById('nav-categories').addEventListener('click', function() {
    displaySearchInputs();
    hideNavMenu();
    document.getElementById('meal-cards').classList.add('d-none');
    document.getElementById('meal-description').classList.add('d-none');
    document.getElementById('search').classList.add('d-none');
});
document.getElementById('nav-area').addEventListener('click', function() {
    displaySearchInputs();
    hideNavMenu();
    document.getElementById('meal-cards').classList.add('d-none');
    document.getElementById('meal-description').classList.add('d-none');
    document.getElementById('search').classList.add('d-none');
});
document.getElementById('nav-ingredients').addEventListener('click', function() {
    displaySearchInputs();
    hideNavMenu();
    document.getElementById('meal-cards').classList.add('d-none');
    document.getElementById('meal-description').classList.add('d-none');
    document.getElementById('search').classList.add('d-none');
});
document.getElementById('nav-contact').addEventListener('click', function() {
    displaySearchInputs();
    hideNavMenu();
    document.getElementById('meal-cards').classList.add('d-none');
    document.getElementById('meal-description').classList.add('d-none');
});

function displaySearchInputs() {
    let cartoona = `
    <div class="col-md-6">
        <input id="searchByName" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
    </div>
    <div class="col-md-6">
        <input id="searchByFirstLetter" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
    </div>
    `;

    document.querySelector('.search-row').innerHTML = cartoona;

    // Add event listeners for the search inputs
    document.getElementById('searchByName').addEventListener('input', function() {
        let term = document.getElementById('searchByName').value;
        if (term) {
            searchByName(term);
        } else {
            clearMealCards();
        }
    });

    document.getElementById('searchByFirstLetter').addEventListener('input', function() {
        let letter = document.getElementById('searchByFirstLetter').value;
        if (letter.length === 1) {
            searchByFirstLetter(letter);
        } else {
            clearMealCards();
        }
    });
}

async function searchByName(term) {
    try {
        showSpinner();
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
        let data = await response.json();
        let allMeals = data.meals;
        console.log(allMeals);
        displaySearch(allMeals);
        hideSpinner();
    } catch (error) {
        console.error('Error fetching meals:', error);
        hideSpinner();
    }
}

async function searchByFirstLetter(letter) {
    try {
        showSpinner();
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
        let data = await response.json();
        let allMeals = data.meals;
        console.log(allMeals);
        displaySearch(allMeals);
        hideSpinner();
    } catch (error) {
        console.error('Error fetching meals:', error);
        hideSpinner();
    }
}


function displaySearch(meals) {
    let cartoona = '';
    if (!meals || meals.length === 0) {
        cartoona = '<p>No meals found</p>';
    } else {
        meals.forEach(meal => {
            cartoona += `
            <div class="col-lg-3 gy-4">
                <div class="card-meal position-relative overflow-hidden rounded-3" data-id="${meal.idMeal}">
                    <img class="w-100" src="${meal.strMealThumb}" alt="">
                    <div class="card-meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
            </div>`;
        });
    }
    document.querySelector('#search-meals').innerHTML = cartoona;
}

function clearMealCards() {
    document.querySelector('#search-meals').innerHTML = '';
}

document.querySelector('#search-meals').addEventListener('click', function (e) {
    const cardMeal = e.target.closest('.card-meal');
    if (cardMeal) {
        const idMeal = cardMeal.getAttribute('data-id');
        document.getElementById('search').classList.add('d-none');
        document.getElementById('search-meals').classList.add('d-none'); // Ensure meal cards are hidden
        document.getElementById('meal-description').classList.remove('d-none');
        getMealsDetails(idMeal);
    }
});

// ----------------------contact---------------------------

let nameInputTouched = false;
        let emailInputTouched = false;
        let phoneInputTouched = false;
        let ageInputTouched = false;
        let passwordInputTouched = false;
        let repasswordInputTouched = false;

        document.getElementById('nav-contact').addEventListener('click', function() {
        displayContactInputs();
        hideNavMenu();
        document.getElementById('meal-cards').classList.add('d-none');
        document.getElementById('contact').classList.remove('d-none');
    });

    document.getElementById('nav-search').addEventListener('click', function() {
        displaySearchInputs();
        hideNavMenu();
        document.getElementById('meal-cards').classList.add('d-none');
        document.getElementById('meal-description').classList.add('d-none');
        document.getElementById('contact').classList.add('d-none');
    });
    document.getElementById('nav-categories').addEventListener('click', function() {
        displaySearchInputs();
        hideNavMenu();
        document.getElementById('meal-cards').classList.add('d-none');
        document.getElementById('meal-description').classList.add('d-none');
        document.getElementById('contact').classList.add('d-none');
    });
    document.getElementById('nav-area').addEventListener('click', function() {
        displaySearchInputs();
        hideNavMenu();
        document.getElementById('meal-cards').classList.add('d-none');
        document.getElementById('meal-description').classList.add('d-none');
        document.getElementById('contact').classList.add('d-none');
    });
    document.getElementById('nav-ingredients').addEventListener('click', function() {
        displaySearchInputs();
        hideNavMenu();
        document.getElementById('meal-cards').classList.add('d-none');
        document.getElementById('meal-description').classList.add('d-none');
        document.getElementById('contact').classList.add('d-none');
    });

        function displayContactInputs() {
            let cartoona = `
            <div class="container w-75 text-center">
                <div class="row g-4">
                    <div class="col-md-6">
                        <input id="nameInput" type="text" class="form-control" placeholder="Enter Your Name">
                        <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Special characters and numbers not allowed
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="emailInput" type="email" class="form-control" placeholder="Enter Your Email">
                        <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Email not valid *exemple@yyy.zzz
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="phoneInput" type="text" class="form-control" placeholder="Enter Your Phone">
                        <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid Phone Number
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="ageInput" type="number" class="form-control" placeholder="Enter Your Age">
                        <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid age
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="passwordInput" type="password" class="form-control" placeholder="Enter Your Password">
                        <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid password *Minimum eight characters, at least one letter and one number:*
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="repasswordInput" type="password" class="form-control" placeholder="Repassword">
                        <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid repassword 
                        </div>
                    </div>
                </div>
                <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
            </div>
            `;
            document.querySelector('.contact-row').innerHTML = cartoona;

            const inputs = document.querySelectorAll('#nameInput, #emailInput, #phoneInput, #ageInput, #passwordInput, #repasswordInput');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    if (input.id === 'nameInput') nameInputTouched = true;
                    if (input.id === 'emailInput') emailInputTouched = true;
                    if (input.id === 'phoneInput') phoneInputTouched = true;
                    if (input.id === 'ageInput') ageInputTouched = true;
                    if (input.id === 'passwordInput') passwordInputTouched = true;
                    if (input.id === 'repasswordInput') repasswordInputTouched = true;
                });

                input.addEventListener('keyup', inputsValidation);
            });
        }

        function inputsValidation() {
            if (nameInputTouched) {
                validateInput('name', nameValidation());
            }
            if (emailInputTouched) {
                validateInput('email', emailValidation());
            }
            if (phoneInputTouched) {
                validateInput('phone', phoneValidation());
            }
            if (ageInputTouched) {
                validateInput('age', ageValidation());
            }
            if (passwordInputTouched) {
                validateInput('password', passwordValidation());
            }
            if (repasswordInputTouched) {
                validateInput('repassword', repasswordValidation());
            }

            if (allValidations()) {
                document.getElementById("submitBtn").removeAttribute("disabled");
            } else {
                document.getElementById("submitBtn").setAttribute("disabled", true);
            }
        }

        function validateInput(inputId, isValid) {
            const alertElement = document.getElementById(`${inputId}Alert`);
            if (isValid) {
                alertElement.classList.replace("d-block", "d-none");
            } else {
                alertElement.classList.replace("d-none", "d-block");
            }
        }

        function allValidations() {
            return nameValidation() &&
                   emailValidation() &&
                   phoneValidation() &&
                   ageValidation() &&
                   passwordValidation() &&
                   repasswordValidation();
        }

        function nameValidation() {
            return /^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value);
        }

        function emailValidation() {
            return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value);
        }

        function phoneValidation() {
            return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value);
        }

        function ageValidation() {
            return /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value);
        }

        function passwordValidation() {
            return /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value);
        }

        function repasswordValidation() {
            return document.getElementById("repasswordInput").value === document.getElementById("passwordInput").value;
        }


        function showSpinner() {
            document.getElementById('spinner').style.display = 'block';
        }
        
        function hideSpinner() {
            document.getElementById('spinner').style.display = 'none';
        }

});

