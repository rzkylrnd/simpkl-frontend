<template>
  <div :class="['rounded-xl shadow overflow-x-auto', darkMode ? 'bg-gray-800 border border-gray-700' : 'light-card']">
    <div :class="['flex flex-wrap items-center gap-3 p-3 border-b print-hide', darkMode ? 'border-gray-700' : 'border-gray-200']">
      <div class="relative flex-1 min-w-[180px] max-w-xs">
        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none" :class="darkMode ? 'text-gray-500' : 'text-gray-400'"></i>
        <input
          v-model="search"
          type="text"
          :placeholder="searchPlaceholder"
          :class="['w-full pl-9 pr-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 transition', darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'light-input placeholder-gray-400']"
        />
      </div>
      <div v-if="paginate" class="ml-auto flex items-center gap-2 text-sm" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">
        <span class="text-xs">Tampil</span>
        <select v-model="pageSize" :class="['px-2 py-1.5 rounded-lg border text-sm', darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'light-input']">
          <option v-for="n in pageSizeOptions" :key="n" :value="n">{{ n }}</option>
        </select>
        <span class="text-xs">baris</span>
      </div>
    </div>

    <table class="w-full text-sm">
      <thead :class="darkMode ? 'bg-gray-700' : 'light-table-header'">
        <tr>
          <th v-if="selectable" class="p-3 w-8 print-hide">
            <input
              type="checkbox"
              class="h-4 w-4 accent-blue-600 cursor-pointer align-middle"
              :checked="allChecked"
              @change="toggleAllSelected"
            />
          </th>
          <th
            v-for="col in columns"
            :key="col.key"
            :title="col.title"
            :class="['p-3 whitespace-nowrap', col.align === 'center' ? 'text-center' : 'text-left']"
            @click="col.sortable && toggleSort(col.key)"
          >
            <span class="inline-flex items-center gap-1" :class="col.sortable ? 'cursor-pointer select-none' : ''">
              {{ col.label }}
              <span v-if="col.sortable" class="text-[10px]" :class="darkMode ? 'text-gray-400' : 'text-gray-400'">
                <i v-if="sortKey === col.key && sortDir === 'asc'" class="fas fa-sort-up"></i>
                <i v-else-if="sortKey === col.key && sortDir === 'desc'" class="fas fa-sort-down"></i>
                <i v-else class="fas fa-sort"></i>
              </span>
            </span>
          </th>
          <th v-if="actionsHeader" class="p-3 text-center whitespace-nowrap">{{ actionsHeader }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, i) in tableRows"
          :key="getKey(item)"
          :class="[
            i % 2 === 0 ? (darkMode ? 'bg-gray-800' : 'bg-white') : (darkMode ? 'bg-gray-700' : 'bg-gray-50'),
            darkMode ? 'hover:bg-gray-600 transition-colors' : 'light-table-row',
            rowClass ? rowClass(item) : '',
          ]"
        >
          <td v-if="selectable" class="p-3 print-hide">
            <input
              type="checkbox"
              class="h-4 w-4 accent-blue-600 cursor-pointer"
              :checked="isSelected(item)"
              @change="toggleSelected(item)"
            />
          </td>
          <td
            v-for="col in columns"
            :key="col.key"
            :class="tdClass(item, col)"
          >
            <slot v-if="slots['cell-' + col.key]" :name="'cell-' + col.key" :item="item" :value="cellValue(item, col)" :column="col">
              {{ defaultCell(item, col) }}
            </slot>
            <span v-else>{{ defaultCell(item, col) }}</span>
          </td>
          <td v-if="actionsHeader" class="p-3 text-center whitespace-nowrap">
            <slot name="actions" :item="item"></slot>
          </td>
        </tr>
        <tr v-if="!tableRows.length">
          <td :colspan="columns.length + (selectable ? 1 : 0) + (actionsHeader ? 1 : 0)" class="p-6 text-center" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">
            {{ search.trim() ? 'Tidak ada data yang cocok' : emptyText }}
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="paginate && pageCount > 1" :class="['flex flex-wrap items-center gap-2 p-3 border-t print-hide', darkMode ? 'border-gray-700' : 'border-gray-200']">
      <span class="text-xs" :class="darkMode ? 'text-gray-400' : 'text-gray-500'">
        Menampilkan {{ rangeStart }}–{{ rangeEnd }} dari {{ sorted.length }}
      </span>
      <div class="ml-auto flex items-center gap-1">
        <button
          @click="goPage(current - 1)"
          :disabled="current <= 1"
          :class="['px-2.5 py-1.5 rounded-lg text-xs transition disabled:opacity-40', darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
        ><i class="fas fa-chevron-left"></i></button>
        <template v-for="p in pageNumbers" :key="p">
          <span v-if="p === '...'" class="px-1 text-xs" :class="darkMode ? 'text-gray-500' : 'text-gray-400'">…</span>
          <button
            v-else
            @click="goPage(p)"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition',
              p === current
                ? 'bg-blue-600 text-white'
                : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ]"
          >{{ p }}</button>
        </template>
        <button
          @click="goPage(current + 1)"
          :disabled="current >= pageCount"
          :class="['px-2.5 py-1.5 rounded-lg text-xs transition disabled:opacity-40', darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
        ><i class="fas fa-chevron-right"></i></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, useSlots } from 'vue'
import { useThemeStore } from '../stores/theme'

const props = defineProps({
  items: { type: Array, default: () => [] },
  columns: { type: Array, required: true },
  idKey: { type: String, default: 'id' },
  actionsHeader: { type: String, default: '' },
  searchPlaceholder: { type: String, default: 'Cari...' },
  emptyText: { type: String, default: 'Tidak ada data' },
  pageSizeOptions: { type: Array, default: () => [10, 25, 50, 100] },
  selectable: { type: Boolean, default: false },
  selected: { type: Array, default: () => [] },
  paginate: { type: Boolean, default: true },
  rowClass: { type: Function, default: null },
})

const emit = defineEmits(['update:selected'])

const slots = useSlots()

const themeStore = useThemeStore()
const darkMode = computed(() => themeStore.darkMode)

const search = ref('')
const pageSize = ref(10)
const current = ref(1)
const sortKey = ref('')
const sortDir = ref('asc')

function valueOf(item, key) {
  return key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), item)
}

function cellValue(item, col) {
  return col.value ? col.value(item) : valueOf(item, col.key)
}

function defaultCell(item, col) {
  const v = cellValue(item, col)
  const fallback = col.emptyText !== undefined ? col.emptyText : '-'
  return v == null || v === '' ? fallback : v
}

function tdClass(item, col) {
  const cls = ['p-3 whitespace-nowrap', col.align === 'center' ? 'text-center' : 'text-left']
  if (typeof col.cellClass === 'function') cls.push(col.cellClass(item))
  else if (typeof col.class === 'function') cls.push(col.class(cellValue(item, col)))
  else if (col.class) cls.push(col.class)
  return cls
}

function getKey(item) {
  return item[props.idKey] ?? JSON.stringify(item)
}

function columnByKey(key) {
  return props.columns.find((c) => c.key === key)
}

function isSelected(item) {
  return props.selected.includes(getKey(item))
}

function toggleSelected(item) {
  const key = getKey(item)
  const arr = isSelected(item)
    ? props.selected.filter((k) => k !== key)
    : [...props.selected, key]
  emit('update:selected', arr)
}

const allChecked = computed(
  () => props.items.length > 0 && props.items.every((i) => isSelected(i))
)

function toggleAllSelected() {
  const all = props.items.map(getKey)
  emit('update:selected', allChecked.value ? [] : all)
}

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return props.items
  const searchable = props.columns.filter((c) => c.searchable !== false)
  return props.items.filter((item) => {
    if (!searchable.length) {
      return Object.values(item).some((v) => String(v ?? '').toLowerCase().includes(q))
    }
    return searchable.some((c) => String(cellValue(item, c) ?? '').toLowerCase().includes(q))
  })
})

const sorted = computed(() => {
  if (!sortKey.value) return [...filtered.value]
  const key = sortKey.value
  const col = columnByKey(key)
  const dir = sortDir.value === 'asc' ? 1 : -1
  return [...filtered.value].sort((a, b) => {
    const va = col?.value ? col.value(a) : valueOf(a, key)
    const vb = col?.value ? col.value(b) : valueOf(b, key)
    const na = parseFloat(va)
    const nb = parseFloat(vb)
    if (!isNaN(na) && !isNaN(nb)) return (na - nb) * dir
    return String(va ?? '').localeCompare(String(vb ?? '')) * dir
  })
})

const pageCount = computed(() => Math.max(1, Math.ceil(sorted.value.length / pageSize.value)))

const paged = computed(() => {
  const start = (current.value - 1) * pageSize.value
  return sorted.value.slice(start, start + pageSize.value)
})

const tableRows = computed(() => (props.paginate ? paged.value : sorted.value))

const rangeStart = computed(() => (sorted.value.length === 0 ? 0 : (current.value - 1) * pageSize.value + 1))
const rangeEnd = computed(() => Math.min(current.value * pageSize.value, sorted.value.length))

const pageNumbers = computed(() => {
  const total = pageCount.value
  const cur = current.value
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  if (cur <= 3) return [1, 2, 3, 4, '...', total]
  if (cur >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total]
  return [1, '...', cur - 1, cur, cur + 1, '...', total]
})

function toggleSort(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}

function goPage(p) {
  current.value = Math.min(Math.max(p, 1), pageCount.value)
}

watch([search, pageSize], () => {
  current.value = 1
})

watch([() => props.items.length, pageCount], () => {
  current.value = Math.min(current.value, pageCount.value)
})
</script>