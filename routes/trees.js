/*jshint esversion: 6 */
const express = require('express');
const router = express.Router();

const Handlebars = require('handlebars');

router.get('/user/:id', loadUserPage);

// router.get('/', getProducts);
// router.get('/:id/edit', editForm);
// router.get('/:id', getProduct);

// router.post('/', trySaveData);

// router.put('/:id', editProduct);

// router.delete('/:id', deleteProduct);


function loadUserPage(req, res){
  let id = Number(req.params.id);
  let rels = { relations: getRelations(id) };
  let htmlString = new Handlebars.SafeString(createRelationsHTML(rels));
  let locals = { ulstring : htmlString } ;
  res.render('mainList', locals);
}

function getName(thisID){
  let fullTree = familyTree.family_members;
  let person = fullTree.filter( p => {
    if (p.id === thisID) return p;
  } );
  return person[0];
}

function getRelations(thisID){
  let relationsArray = [];
  let currentPerson = getName(thisID);
  let fullTree = familyTree.family_members;
  let dadID = currentPerson.father_id;
  let momID = currentPerson.mother_id;
  let house = currentPerson.family_id;
  for (var i = 0; i < fullTree.length; i++) {
    if (fullTree[i].id === currentPerson.id) relationsArray.push(createRelObj(fullTree[i], 'self'));
    else if (fullTree[i].id === dadID) relationsArray.push(createRelObj(fullTree[i], 'father'));
    else if (fullTree[i].id === momID) relationsArray.push(createRelObj(fullTree[i], 'mother'));
    else if (fullTree[i].father_id === dadID && fullTree[i].mother_id === momID) relationsArray.push(createRelObj(fullTree[i], 'sibling'));
    else if (fullTree[i].father_id === currentPerson.id || fullTree[i].mother_id === currentPerson.id) relationsArray.push(createRelObj(fullTree[i], 'child'));
    else if (fullTree[i].id === currentPerson.spouse_id) relationsArray.push(createRelObj(fullTree[i], 'spouse'));
    else if (fullTree[i].extended_family_id === house) relationsArray.push(createRelObj(fullTree[i], 'extended family'));
  }
  return relationsArray;
}

function createRelObj(item, rel){
  let isSelf = false;
  let isSibling = false;
  let isChild = false;
  let isSpouse = false;
  let isExtRel = false;

  switch (rel){
    case "sibling":
      if (item.gender === "male"){ rel = "brother"; } else {rel = "sister";}
      isSibling = true;
      break;
    case "spouse":
      if (item.gender === "male"){ rel = "husband"; } else {rel = "wife";}
      isSpouse = true;
      break;
    case "child":
      if (item.gender === "male"){ rel = "son"; } else { rel = "daughter"; }
      isChild = true;
      break;
    case "extended family":
      isExtRel = true;
      break;
    case "self":
      isSelf = true;
      break;
    default:
      break;
  }
  return {
    id: item.id,
    name: `${item.fname} ${item.lname}`,
    relation: rel,
    isSelf: isSelf,
    isSibling: isSibling,
    isChild: isChild,
    isSpouse: isSpouse,
    isExtRel: isExtRel,
    url: item.photo_url
  };
}

function createRelationsHTML(relObj){

  let relArray = relObj.relations;
  let html = `<ul id="org" style="display:none">`;


  let father = relArray.filter(rel => {
    if(rel.relation === 'father'){
      return rel;
    }
  });
  //html += createListItem(father);

  // let mother = relArray.filter(rel => {
  //   if(rel.relation === 'mother'){
  //     return rel;
  //   }
  // });
  html += createMainParentItem(father);

  let self = relArray.filter(rel => {
    if(rel.relation === 'self' || rel.relation === 'wife' || rel.relation === 'husband' || rel.relation === 'daughter' || rel.relation === 'son' || rel.relation === 'extended family'){
      return rel;
    }
  });

  html += createSelfItem(self);

  let siblings = relArray.filter(rel => {
    if(rel.relation === 'brother' || rel.relation === 'sister'){
      return rel;
    }
  });

  html += createListItem(siblings) + '</li></ul></ul>';

  return html;
}

function createSelfItem(relObj){

  console.log(relObj);

  let myself = relObj.filter(rel => {
    if(rel.relation === 'self'){
      return rel;
    }
  });

  let children = relObj.filter(rel => {
    if(rel.relation === 'son' || rel.relation === 'daughter' || rel.relation === 'extended family' ){
      return rel;
    }
  });

  // let extFam = relObj.filter(rel => {
  //   if(rel.relation === 'extended family'){
  //     return rel;
  //   }
  // });

  let spouse = relObj.filter(rel => {
    if(rel.relation === 'wife' || rel.relation === 'husband'){
      return rel;
    }
  });

  let html = `<ul><li class = "person">
        <div class="person-outer ${myself[0].relation}">
          <div class="person-top"></div>
          <div class="person-middle">
            <div class="person-left"></div>
            <div class="person-photo">
             <img class="person-img" src="/images/${myself[0].url}" alt="${myself[0].name} image">
              <p class="personName">${myself[0].name}</p>
              <p class="relationship">${myself[0].relation}</p>
            </div>
            <div class="person-right"></div>
          </div>
          <div class="person-bottom"></div>
        </div>`;
    if (children.length > 0) {
          html += '<ul>';
          for (var j = 0; j < children.length; j++) {
              html += `<li class = "person">
                  <div class="person-outer ${children[j].relation}">
                    <div class="person-top"></div>
                    <div class="person-middle">
                      <div class="person-left"></div>
                      <div class="person-photo">
                       <img class="person-img" src="/images/${children[j].url}" alt="${children[j].name} image">
                        <p class="personName">${children[j].name}</p>
                        <p class="relationship">${children[j].relation}</p>
                      </div>
                      <div class="person-right"></div>
                    </div>
                    <div class="person-bottom"></div>
                  </div>
                  </li>`;
          }
          html += '</ul>';
     }

   // if (extFam.length > 0) {
   //    html += '<ul>';
   //    for (var k = 0; k < extFam.length; k++) {
   //          html += `<li class = "person">
   //              <div class="person-outer ${extFam[k].relation}">
   //                <div class="person-top"></div>
   //                <div class="person-middle">
   //                  <div class="person-left"></div>
   //                  <div class="person-photo">
   //                   <img class="person-img" src="/images/${extFam[k].url}" alt="${extFam[k].name} image">
   //                    <p class="personName">${extFam[k].name}</p>
   //                    <p class="relationship">${extFam[k].relation}</p>
   //                  </div>
   //                  <div class="person-right"></div>
   //                </div>
   //                <div class="person-bottom"></div>
   //              </div>`;
   //          }
   //      html += '</ul>';
   //    }
    html += '</li>';

    if (spouse.length > 0){
          for (var l = 0; l < spouse.length; l++) {
              html += `<li class = "person">
                  <div class="person-outer ${spouse[l].relation}">
                    <div class="person-top"></div>
                    <div class="person-middle">
                      <div class="person-left"></div>
                      <div class="person-photo">
                       <img class="person-img" src="/images/${spouse[l].url}" alt="${spouse[l].name} image">
                        <p class="personName">${spouse[l].name}</p>
                        <p class="relationship">${spouse[l].relation}</p>
                      </div>
                      <div class="person-right"></div>
                    </div>
                    <div class="person-bottom"></div>
                  </div>
                  </li>`;
            }
      return html += '</ul>';
    }
}

function createMainParentItem(relObj){
  let html = '';

  for (var i = 0; i < relObj.length; i++) {
    html += `<li class = "person">
      <div class="person-outer ${relObj[i].relation}">
        <div class="person-top"></div>
        <div class="person-middle">
          <div class="person-left"></div>
          <div class="person-photo">
           <img class="person-img" src="/images/${relObj[i].url}" alt="${relObj.name} image">
            <p class="personName">${relObj[i].name}</p>
            <p class="relationship">${relObj[i].relation}</p>
          </div>
          <div class="person-right"></div>
        </div>
        <div class="person-bottom"></div>
      </div>`;
  }
  return html;
}

function createListItem(relObj){
  let html = '';

  for (var i = 0; i < relObj.length; i++) {
    html += `<li class = "person">
      <div class="person-outer ${relObj[i].relation}">
        <div class="person-top"></div>
        <div class="person-middle">
          <div class="person-left"></div>
          <div class="person-photo">
           <img class="person-img" src="/images/${relObj[i].url}" alt="${relObj.name} image">
            <p class="personName">${relObj[i].name}</p>
            <p class="relationship">${relObj[i].relation}</p>
          </div>
          <div class="person-right"></div>
        </div>
        <div class="person-bottom"></div>
      </div>
      </li>`;
  }
  return html;
}


let familyTree = { "family_members" :
  [
      {
        "id" : 1,
        "fname" : "Rickard",
        "lname" : "Stark",
        "gender": "male",
        "father_id" : 0,
        "mother_id" : 0,
        "spouse_id" : 2,
        "family" : "Stark",
        "photo_url": "1.png"
      },

      {
        "id" : 2,
        "fname" : "Unknown",
        "lname" : "Unknown",
        "gender": "female",
        "father_id" : 0,
        "mother_id" : 0,
        "spouse_id" : 1,
        "family" : "Stark",
        "photo_url": ""
      },

      {
        "id" : 3,
        "fname" : "Hoster",
        "lname" : "Tully",
        "gender": "male",
        "father_id" : 0,
        "mother_id" : 0,
        "spouse_id" : 4,
        "family_id" : "Tully",
        "photo_url": ""
      },

      {
        "id" : 4,
        "fname" : "Minisa",
        "lname" : "Whent",
        "gender": "female",
        "father_id" : 0,
        "mother_id" : 0,
        "spouse_id" : 3,
        "family_id" : "Whent",
        "photo_url": ""
      },

      {
        "id" : 5,
        "fname" : "Ned",
        "lname" : "Stark",
        "gender": "male",
        "spouse_id" : 9,
        "father_id" : 1,
        "mother_id" : 2,
        "family_id" : "Stark",
        "photo_url": "5.jpg"
      },

      {
        "id" : 6,
        "fname" : "Brandon",
        "lname" : "Stark",
        "gender": "male",
        "father_id" : 1,
        "mother_id" : 2,
        "family_id" : "Stark",
        "photo_url": "6.png"
      },

      {
        "id" : 7,
        "fname" : "Lyanna",
        "lname" : "Stark",
        "gender": "female",
        "father_id" : 1,
        "mother_id" : 2,
        "family_id" : "Stark",
        "photo_url": "7.jpg"
      },

      {
        "id" : 8,
        "fname" : "Benjen",
        "lname" : "Stark",
        "gender": "male",
        "father_id" : 1,
        "mother_id" : 2,
        "family_id" : "Stark",
        "photo_url": "8.png"
      },


      {
        "id" : 9,
        "fname" : "Catelyn",
        "lname" : "Tully",
        "gender": "female",
        "spouse_id" : 5,
        "father_id" : 3,
        "mother_id" : 4,
        "family_id" : "Tully",
        "photo_url": "9.jpg"
      },


      {
        "id" : 10,
        "fname" : "Robb",
        "lname" : "Stark",
        "gender": "male",
        "father_id" : 5,
        "mother_id" : 9,
        "family_id" : "Stark",
        "photo_url": "10.jpg"
      },

      {
        "id" : 11,
        "fname" : "Sansa",
        "lname" : "Stark",
        "gender": "female",
        "father_id" : 5,
        "mother_id" : 9,
        "family_id" : "Stark",
        "photo_url": "11.jpg"
      },

      {
        "id" : 12,
        "fname" : "Arya",
        "lname" : "Stark",
        "gender": "female",
        "father_id" : 5,
        "mother_id" : 9,
        "family_id" : "Stark",
        "photo_url": "12.jpg"
      },

      {
        "id" : 13,
        "fname" : "Brandon",
        "lname" : "Stark",
        "gender": "male",
        "father_id" : 5,
        "mother_id" : 9,
        "family_id" : "Stark",
        "photo_url": "13.jpg"
      },

      {
        "id" : 14,
        "fname" : "Rickon",
        "lname" : "Stark",
        "gender": "male",
        "father_id" : 5,
        "mother_id" : 9,
        "family_id" : "Stark",
        "photo_url": "14.jpg"
      },

      {
        "id" : 15,
        "fname" : "Edmure",
        "lname" : "Tully",
        "gender": "male",
        "father_id" : 3,
        "mother_id" : 4,
        "family_id" : "Tully",
        "photo_url": ""
      },

      {
          "id" : 16,
          "fname" : "Lysa",
          "lname" : "Tully",
          "gender": "female",
          "father_id" : 3,
          "mother_id" : 4,
          "family_id" : "Tully",
        "photo_url": ""
      },

      {
          "id" : 17,
          "fname" : "Brynden",
          "lname" : "Tully",
          "gender": "male",
          "father_id" : 3,
          "mother_id" : 4,
          "family_id" : "Tully",
        "photo_url": ""
      },

      {
          "id" : 18,
          "fname" : "Hodor",
          "lname" : "",
          "gender": "male",
          "father_id" : 0,
          "mother_id" : 0,
          "family_id" : "",
          "extended_family_id" : "Stark",
          "photo_url": "18.jpg"
      },

      {
          "id" : 19,
          "fname" : "Theon",
          "lname" : "Greyjoy",
          "gender": "male",
          "father_id" : 0,
          "mother_id" : 0,
          "family_id" : "Greyjoy",
          "extended_family_id" : "Stark",
          "photo_url": "19.jpg"
      },

      {
          "id" : 20,
          "fname" : "John",
          "lname" : "Snow",
          "gender": "male",
          "father_id" : 0,
          "mother_id" : 0,
          "family_id" : "",
          "extended_family_id" : "Stark",
          "photo_url": "20.jpg"
      },

  ]

};

// (function(){
//   console.log(getRelations(5));
// })();

module.exports = router;