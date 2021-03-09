var li = document.getElementsByTagName("li");
Array.from(li).forEach((item,index)=>{
  if(index % 2 == 0){
    item.style.backgroundColor = "red"
  }else{
    item.style.backgroundColor = "black"
  }
})