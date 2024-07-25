import mockjs from 'mockjs'

const data = mockjs.mock({
  'list|10': [
    {
      'id|+1': 1,
      name: '@cname',
      'age|1-100': 1,
      email: '@email',
      phone: /^1[34578]\d{9}$/,
      address: '@county(true)',
      createTime: '@datetime',
      updateTime: '@datetime',
    },
  ],
})

export default [
  {
    method: 'post',
    url: '/api/user',
    response: ({ body } = {}) => {
      return {
        code: 200,
        data: data.list,
        message: 'success',
      }
    },
  },
]
