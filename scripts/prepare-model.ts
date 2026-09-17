import { loadMatcher, LOCAL_MODEL } from '../server/local-model';
await loadMatcher();
console.log('Local matching model ready: '+LOCAL_MODEL);
