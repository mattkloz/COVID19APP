<template>
    <div>
        <getmap/>
    </div>
  
</template>

<script>
import { mapState } from 'vuex'
import getmap from "../../components/shared/map.vue";

export default {
    components: {
        getmap,
    },
}
</script>

<style lang="scss" scoped>

</style>