<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCoursesStore } from '@/stores/courses'
import type { Course, CourseFormData } from '@/types/course'

const props = defineProps<{
  courseId?: string
}>()

const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'cancel'): void
}>()

const store = useCoursesStore()

const formData = ref<CourseFormData>({
  title: '',
  description: '',
  price: 0,
  category: '',
  level: 'beginner',
  tags: [],
})

const imageFile = ref<File | null>(null)
const imagePreview = ref<string>('')

const categories = ['Программирование', 'Дизайн', 'Маркетинг', 'Бизнес', 'Языки', 'Другое']

const levels = [
  { value: 'beginner', label: 'Начинающий' },
  { value: 'intermediate', label: 'Средний' },
  { value: 'advanced', label: 'Продвинутый' },
]

const tagsInput = ref('')

const handleImageUpload = (event: any) => {
  console.log('handleImageUpload', event)
  if (event.files && event.files[0]) {
    imageFile.value = event.files[0]
    imagePreview.value = URL.createObjectURL(event.files[0])
  }
}

const handleSubmit = async () => {
  // Валидация обязательных полей
  if (!formData.value.title.trim()) {
    store.error = 'Название курса обязательно'
    return
  }
  if (!formData.value.category) {
    store.error = 'Выберите категорию'
    return
  }
  if (!imageFile.value) {
    store.error = 'Необходимо загрузить изображение'
    return
  }

  // Преобразование строки тегов в массив
  formData.value.tags = tagsInput.value
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)

  const submitData = {
    ...formData.value,
    image: imageFile.value,
  }

  // Подробное логирование
  console.log('Отправляемые данные:', {
    title: submitData.title,
    description: submitData.description,
    price: submitData.price,
    category: submitData.category,
    level: submitData.level,
    tags: submitData.tags,
    image:
      submitData.image instanceof File
        ? {
            name: submitData.image.name,
            type: submitData.image.type,
            size: submitData.image.size,
          }
        : submitData.image,
  })

  try {
    if (props.courseId) {
      await store.updateCourse(props.courseId, submitData)
    } else {
      await store.createCourse(submitData)
    }
    emit('submit')
  } catch (error: any) {
    console.error('Error submitting course:', error)
    console.error('Error response:', error.response?.data)
    store.error = error.response?.data?.message || 'Произошла ошибка при сохранении курса'
  }
}

const handleCancel = () => {
  emit('cancel')
}

onMounted(async () => {
  if (props.courseId) {
    const course = await store.fetchCourseById(props.courseId)
    if (course) {
      formData.value = {
        title: course.title,
        description: course.description || '',
        price: course.price,
        category: course.category,
        level: course.level,
        tags: course.tags.map((tag) => tag.name),
      }
      tagsInput.value = course.tags.map((tag) => tag.name).join(', ')
      imagePreview.value = course.image
    }
  }
})
</script>

<template>
  <app-card>
    <template #title></template>
    <template #content>
      <div class="bg-surface-50 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
        <div
          class="min-w-400 bg-surface-0 dark:bg-surface-900 shadow rounded-border w-full lg:w-6/12 mx-auto"
        >
          <div>
            <label for="title" class="text-surface-900 dark:text-surface-0 font-medium mb-2 block"
              >Название курса</label
            >
            <app-input
              v-model="formData.title"
              id="title"
              type="text"
              placeholder="Название курса"
              class="w-full mb-4"
            />

            <label
              for="description"
              class="text-surface-900 dark:text-surface-0 font-medium mb-2 block"
              >Описание</label
            >

            <app-textarea
              v-model="formData.description"
              id="description"
              placeholder="Описание курса"
              class="w-full mb-4"
            />

            <label for="price" class="text-surface-900 dark:text-surface-0 font-medium mb-2 block"
              >Цена</label
            >
            <app-input-number
              v-model="formData.price"
              id="price"
              type="text"
              placeholder=""
              class="w-full mb-4"
              mode="currency"
              currency="RUB"
            />
            <label
              for="category"
              class="text-surface-900 dark:text-surface-0 font-medium mb-2 block"
              >Категория</label
            >
            <app-select
              v-model="formData.category"
              id="category"
              placeholder="Выберите категорию"
              class="w-full mb-4"
              :options="categories"
            />
            <label for="level" class="text-surface-900 dark:text-surface-0 font-medium mb-2 block"
              >Уровень</label
            >
            <app-select
              v-model="formData.level"
              id="level"
              placeholder="Выберите уровень"
              class="w-full mb-4"
              :options="levels"
              optionLabel="label"
              optionValue="value"
            />
            <label for="tags" class="text-surface-900 dark:text-surface-0 font-medium mb-2 block"
              >Теги</label
            >

            <app-input
              v-model="tagsInput"
              id="tags"
              type="text"
              placeholder="Например: JavaScript, Vue, TypeScript"
              class="w-full mb-4"
            />
            <label for="image" class="text-surface-900 dark:text-surface-0 font-medium mb-2 block"
              >Изображение</label
            >

            <div class="card flex flex-column items-center gap-6">
              <app-file-upload
                mode="basic"
                @select="handleImageUpload"
                customUpload
                auto
                severity="secondary"
                class="p-button-outlined"
              />
              <img
                v-if="imagePreview"
                :src="imagePreview"
                alt="Image"
                class="shadow-md rounded-xl w-full sm:w-64"
                style="filter: grayscale(100%)"
              />
            </div>
            <div class="flex justify-end">
              <app-button label="Отменить" @click="handleCancel" />
              <app-button label="Сохранить" @click="handleSubmit" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </app-card>
</template>

<style scoped></style>
