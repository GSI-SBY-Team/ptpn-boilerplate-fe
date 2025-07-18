<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
const page = ref({ title: 'CRUD Table' });
const breadcrumbs = ref([
    {
        text: 'Dashboard',
        disabled: false,
        href: '#'
    },
    {
        text: 'CRUD Table',
        disabled: true,
        href: '#'
    }
]);

const dialog = ref(false)
const dialogDelete = ref(false)
const headers = ref([
    {
        title: 'Dessert (100g serving)',
        align: 'start',
        sortable: false,
        key: 'name',
    },
    { title: 'Calories', key: 'calories' },
    { title: 'Fat (g)', key: 'fat' },
    { title: 'Carbs (g)', key: 'carbs' },
    { title: 'Protein (g)', key: 'protein' },
    { title: 'Actions', key: 'actions', sortable: false },
])
const desserts = ref([])
const editedIndex = ref(-1)
const editedItem = ref({
    name: '',
    calories: 0,
    fat: 0,
    carbs: 0,
    protein: 0,
})
const defaultItem = ref({
    name: '',
    calories: 0,
    fat: 0,
    carbs: 0,
    protein: 0,
})
const formTitle = computed(() => {
    return editedIndex.value === -1 ? 'New Item' : 'Edit Item'
})
function initialize() {
    desserts.value = [
        {
            name: 'Frozen Yogurt',
            calories: 159,
            fat: 6,
            carbs: 24,
            protein: 4,
        },
        {
            name: 'Ice cream sandwich',
            calories: 237,
            fat: 9,
            carbs: 37,
            protein: 4.3,
        },
        {
            name: 'Eclair',
            calories: 262,
            fat: 16,
            carbs: 23,
            protein: 6,
        },
        {
            name: 'Cupcake',
            calories: 305,
            fat: 3.7,
            carbs: 67,
            protein: 4.3,
        },
        {
            name: 'Gingerbread',
            calories: 356,
            fat: 16,
            carbs: 49,
            protein: 3.9,
        },
        {
            name: 'Jelly bean',
            calories: 375,
            fat: 0,
            carbs: 94,
            protein: 0,
        },
        {
            name: 'Lollipop',
            calories: 392,
            fat: 0.2,
            carbs: 98,
            protein: 0,
        },
        {
            name: 'Honeycomb',
            calories: 408,
            fat: 3.2,
            carbs: 87,
            protein: 6.5,
        },
        {
            name: 'Donut',
            calories: 452,
            fat: 25,
            carbs: 51,
            protein: 4.9,
        },
        {
            name: 'KitKat',
            calories: 518,
            fat: 26,
            carbs: 65,
            protein: 7,
        },
    ]
}
function editItem(item) {
    editedIndex.value = desserts.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
    dialog.value = true
}
function deleteItem(item) {
    editedIndex.value = desserts.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
    dialogDelete.value = true
}
function deleteItemConfirm() {
    desserts.value.splice(editedIndex.value, 1)
    closeDelete()
}
function close() {
    dialog.value = false
    nextTick(() => {
        editedItem.value = Object.assign({}, defaultItem.value)
        editedIndex.value = -1
    })
}
function closeDelete() {
    dialogDelete.value = false
    nextTick(() => {
        editedItem.value = Object.assign({}, defaultItem.value)
        editedIndex.value = -1
    })
}
function save() {
    if (editedIndex.value > -1) {
        Object.assign(desserts.value[editedIndex.value], editedItem.value)
    } else {
        desserts.value.push(editedItem.value)
    }
    close()
}
watch(dialog, val => {
    val || close()
})
watch(dialogDelete, val => {
    val || closeDelete()
})
initialize()
</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row>
        <v-col cols="12">
            <UiParentCard title="Crud Table">
                <v-data-table class="border rounded-md" :headers="headers" :items="desserts" :sort-by="[{ key: 'calories', order: 'asc' }]">
                    <template v-slot:top>
                        <v-toolbar class="bg-lightprimary" flat>
                            <v-toolbar-title>My Crud Table</v-toolbar-title>

                            <v-dialog v-model="dialog" max-width="500px">
                                <template v-slot:activator="{ props }">
                                    <v-btn color="primary"  variant="flat" dark  v-bind="props" >Add New Item</v-btn>
                                </template>
                                <v-card>
                                    <v-card-title class="pa-4 bg-secondary">
                                        <span class="text-h5">{{ formTitle }}</span>
                                    </v-card-title>

                                    <v-card-text>
                                        <v-container class="px-0">
                                            <v-row>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field v-model="editedItem.name"
                                                        label="Dessert name"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field v-model="editedItem.calories"
                                                        label="Calories"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field v-model="editedItem.fat" label="Fat (g)"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field v-model="editedItem.carbs"
                                                        label="Carbs (g)"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field v-model="editedItem.protein"
                                                        label="Protein (g)"></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>

                                    <v-card-actions class="pa-6">
                                        <v-spacer></v-spacer>
                                        <v-btn color="error" variant="flat" dark   @click="close">
                                            Cancel
                                        </v-btn>
                                        <v-btn color="success" variant="flat" dark   @click="save">
                                            Save
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                            <v-dialog v-model="dialogDelete" max-width="500px">
                                <v-card >
                                    <v-card-title class="text-h5 text-center py-6">Are you sure you want to delete this item?</v-card-title>
                                    <v-card-actions class="pa-6">
                                        <v-spacer></v-spacer>
                                        <v-btn color="error" variant="flat" dark   @click="closeDelete">Cancel</v-btn>
                                        <v-btn color="success" variant="flat" dark   @click="deleteItemConfirm">OK</v-btn>
                                        <v-spacer></v-spacer>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-toolbar>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-icon color="info" size="small" class="me-2" @click="editItem(item)">
                            mdi-pencil
                        </v-icon>
                        <v-icon color="error" size="small" @click="deleteItem(item)">
                            mdi-delete
                        </v-icon>
                    </template>
                    <template v-slot:no-data>
                        <v-btn color="primary" @click="initialize">
                            Reset
                        </v-btn>
                    </template>
                </v-data-table>
            </UiParentCard>
        </v-col>
    </v-row>
</template>
  
  