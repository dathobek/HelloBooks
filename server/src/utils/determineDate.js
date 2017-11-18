// Function to determine return date for each user
const determineDate = (star) => {
  let newDate;
  if (star === 'bronze') {
    newDate = new Date(new Date().getTime() + (1 * 60 * 1000));
    return newDate;
  }
  if (star === 'silver') {
    newDate = new Date(new Date().getTime() + (2 * 24 * 60 * 60 * 1000));
    return newDate;
  }
  if (star === 'gold') {
    newDate = new Date(new Date().getTime() + (3 * 24 * 60 * 60 * 1000));
    return newDate;
  }
};

export default determineDate;