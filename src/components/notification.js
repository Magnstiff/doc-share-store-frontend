import { notification } from 'ant-design-vue'

export default function show (title, content) {
  notification.open({
    message: title,
    description: content,
    duration: 3,
    placement: 'bottomRight'
  })
}
