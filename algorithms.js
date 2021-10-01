//Algotithms written using pseudocose from FCS lecture
function insertionSort(a) {
  for (let j = 1; j < a.length; j++) {
    let i = 0;
    while (a[j] > a[i]) {
      i = i + 1;
    }
    let m = a[j];
    for (let k = 1; k < j - i - 1; k++) {
      a[j - k] = a[j - k - 1];
    }
    a[i] = m;
  }

  return a;
}

function insertionSort2(inputArr) {
  let length = inputArr.length;
  for (let i = 1; i < length; i++) {
    let key = inputArr[i];
    let j = i - 1;
    while (j >= 0 && inputArr[j] > key) {
      inputArr[j + 1] = inputArr[j];
      j = j - 1;
    }
    inputArr[j + 1] = key;
  }
  return inputArr;
}

function bubbleSort(List) {
  let end = List.length - 1;
  while (end > 1) {
    let i = 0;
    while (!(i > end)) {
      if (List[i] > List[i + 1]) {
        let a = List[i];
        let b = List[i + 1];
        List[i] = b;
        List[i + 1] = a;
      }
      i = i + 1;
    }
    end = end - 1;
  }
  return List;
}

function binarySearch(List, item) {
  let length = List.length;
  let pos = 0;
  if (length === 0) {
    return "Search Failed";
  } else {
    let mid = Math.floor(length / 2);
    if (List[mid] === item) {
      pos++;
      return item + " exists ";
    } else if (List[mid] > item) {
      let listLeft = [];
      for (let index = 0; index < mid; index++) {
        const element = List[index];
        listLeft.push(element);
      }
    
      return binarySearch(listLeft, item);
    } else if (List[mid] < item) {
      let listRight = [];
      for (let index = mid + 1; index < length; index++) {
        const element = List[index];
        listRight.push(element);
      }
     
      return binarySearch(listRight, item);
    }
  }
}

function heapSort(arr) {
  let n = arr.length;
  // Build heap (rearrange array)
  for (let i = parseInt(n / 2 - 1); i >= 0; i--) {
    minHeapify(arr, n, i);
  }

  // One by one extract an element from heap
  for (let i = n - 1; i >= 0; i--) {
    // Move current root to end
    let temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;

    // call max heapify on the reduced heap
    minHeapify(arr, i, 0);
  }

  return arr;
}

function minHeapify(arr, n, i) {
  let smallest = i;
  let l = 2 * i + 1; //left child index
  let r = 2 * i + 2; //right child index

  //If left child is smaller than root
  if (l < n && arr[l] < arr[smallest]) {
    smallest = l;
  }

  // If right child is smaller than smallest so far
  if (r < n && arr[r] < arr[smallest]) {
    smallest = r;
  }

  // If smallest is not root
  if (smallest != i) {
    let temp = arr[i];
    arr[i] = arr[smallest];
    arr[smallest] = temp;

    // Recursively heapify the affected sub-tree
    minHeapify(arr, n, smallest);
  }
}

function QuickSort(List) {
  let pivot;
  let pivotItem;
  let Listleft = [];
  let ListRight = [];
  if (List.length <= 1) {
    return List;
  } else {
    pivot = Math.floor((List.length - 1) / 2);
    pivotItem = List[pivot];
    List.splice(pivot, 1);
    for (let index = 0; index < List.length; index++) {
      const element = List[index];
      if (pivotItem > element) {
        Listleft.push(element);
      } else {
        ListRight.push(element);
      }
    }
  }
  let ans = QuickSort(Listleft) + pivotItem + QuickSort(ListRight);
  return ans;
}

function merge(a, b) {
  let c = [];
  while (a.length > 0 && b.length > 0) {
    let i = 0;
    if (a[i] > b[i]) {
      c.push(b[i]);
      b.splice(i, 1);
    } else {
      c.push(a[i]);
      a.splice(i, 1);
    }
    i++;
  }

  while (a.length > 0) {
    c.push(a[0]);
    a.splice(0, 1);
  }
  while (b.length > 0) {
    c.push(b[0]);
    b.splice(0, 1);
  }
  return c;
}

function mergeSort(List) {
  let length = List.length;
  let ListLeft = [];
  let ListRight = [];
  if (length <= 1) {
    return List;
  }
  for (let index = 0; index <( Math.round(length / 2) - 1); index++) {
    const element = List[index];
    ListLeft.push(element);
  }

  for (let index = (Math.round(length / 2) - 1); index < List.length; index++) {
    const element = List[index];
    ListLeft.push(element);
  }
  ListLeft = mergeSort(ListLeft);
  ListRight = mergeSort(ListRight);
  return merge(ListLeft, ListRight);
}