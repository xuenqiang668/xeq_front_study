/*
给你一个 32 位的有符号整数 x ，返回将 x 中的数字部分反转后的结果。

如果反转后整数超过 32 位的有符号整数的范围 [−231,  231 − 1] ，就返回 0。

假设环境不允许存储 64 位整数（有符号或无符号）。
 

示例 1：

输入：x = 123
输出：321
示例 2：

输入：x = -123
输出：-321
示例 3：

输入：x = 120
输出：21
示例 4：

输入：x = 0
输出：0
 

提示：

-231 <= x <= 231 - 1

*/
const now = new Date().getTime();

// function reverse(x) {
//     if(x === 0) return x

//     if(-Math.pow(2, 31) <= x && x <= Math.pow(2, 31) - 1) {
//         let mx = x + ''

        
        
//         mx = mx.split('').reverse()
//         if(mx[0] === '0') {
//             mx.shift()
//             return Number(mx.join(''))
//         }

//         if(mx.at(-1) === '-') {
//             mx.pop()
//             console.log(mx);
            
//             return Number('-' + (mx).join(''))
//         }

//         return Number(mx.join(""))
//     }

//     return 0
// };



var reverse = function(x) {
    let res = 0;
    if (x >= 0) {
      res = +String(x).split("").reverse().join("");
    } else {
      x = -x;
      res = -String(x).split("").reverse().join("");
    }
    if(res > 2**31 - 1 || res < -(2**31)) return 0;
    return res;
  };
  


const res1 = reverse(123)
// const res2 = reverse(-123)
// const res3 = reverse(120)
// const res4 = reverse(0)
// const res5 = reverse(1232131232131231230)



console.log(res1);
// console.log(res2);
// console.log(res3);
// console.log(res4);
// console.log(res5);


console.log(new Date().getTime() - now);

