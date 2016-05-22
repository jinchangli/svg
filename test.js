ctx.fillStyle = "#eee";
ctx.fillRect(0,0,800,500);

//
// var text = ctx.measureText("Hello");

      // ctx.globalCompositeOperation  = "destination-out";
      ctx.fillStyle = "green";
      ctx.fillRect(50, 40, 146, 48);

      ctx.scale(2,3);

      // ctx.globalCompositeOperation  = "source-over";
      ctx.fillStyle = "red";
      ctx.font = "48px serif";
      ctx.textBaseline = "top";
      ctx.fillText("Hello", 80, 80);


              ctx.beginPath();
              ctx.moveTo(0,0);
              ctx.lineTo(600, 0);
              ctx.lineTo(600, 490);
              ctx.lineTo(0, 490);
              ctx.closePath();

          ctx.moveTo(80,80);
          ctx.lineTo(80, 140);
          ctx.lineTo(220, 140);
          ctx.lineTo(220, 80);
          ctx.closePath();

          ctx.clip();


          ctx.beginPath();
          ctx.moveTo(0,0);
          ctx.lineTo(300,300);
          ctx.stroke();



//source-over

// ctx.globalCompositeOperation = "xor";

// ctx.rect(10,10,10,10);
//
// ctx.fill();
//
// ctx.rect(10,10,20,20);
// ctx.fill();
//
//
// ctx.rect(10,10,10,10);
//
// ctx.fill();
//
// ctx.rect(10,10,20,20);
// ctx.fill();
