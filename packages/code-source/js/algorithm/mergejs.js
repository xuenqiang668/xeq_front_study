/*
合并重叠的子数组，有一个数组包含多个子数组，每个子数组都由不同的时间段[starti,endi]组成，要求合并所有重叠的时间段，返回一个新的二维数组。
输入intervals：一个二维数组，其中每个元素也是一个数组 [start, end] 表示一个时间段，start 和 end 均为整数，且满足 start <= end。
例输入： [[1, 3], [2, 6], [8, 16], [15, 18], [18, 30]];
输出：返回一个二维数组，包含合并后的所有不重叠的时间段。
输出：[[1, 6], [8, 10], [15, 18]]
*/

function mergeFn(arr) {
    arr = arr.sort((a,b) => a[0] - b[0])

    let tepArr = [arr[0]]
    for (let i = 1, j = 0; i < arr.length; i++) {
        const ele = arr[i];
        
        if(tepArr[j][tepArr[j].length - 1] >= ele[0]) {
            tepArr[j].splice(tepArr[j].length -1, 1 , ele[ele.length  -1])
        }else {
            tepArr.push(ele)
            j++
        }
    }
    return tepArr
}

const tsetArr = [[2, 6],[1, 3], [8, 16], [15, 18], [18, 30]]

const res = mergeFn(tsetArr)

console.log(res); // [ [ 1, 6 ], [ 8, 30 ] ]