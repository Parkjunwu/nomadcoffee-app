import { ApolloCache, DefaultContext, FetchResult, gql, MutationFunctionOptions } from "@apollo/client";
import { ErrorOption } from "react-hook-form";
import { urlLink } from "../../urlLink";
import { editCoffeeShop, editCoffeeShopVariables } from "../../__generated__/editCoffeeShop";
import { seeCoffeeShop } from "../../__generated__/seeCoffeeShop";


type Props = {
  editCoffeeShop:(options?: MutationFunctionOptions<editCoffeeShop, editCoffeeShopVariables, DefaultContext, ApolloCache<any>>) => Promise<FetchResult<editCoffeeShop>>
  seeCoffeeShopData:seeCoffeeShop
  editCoffeeShopLoading:boolean
  history:any
  setError:(name: string, error: ErrorOption) => void
}

const editPostOnSubmit = ({editCoffeeShopLoading,seeCoffeeShopData,editCoffeeShop,history,setError}:Props) => {
  return async(data) => {
    if(editCoffeeShopLoading || !seeCoffeeShopData.seeCoffeeShop) return;
    const {


      photoUrl,


      name,
      latitude,
      longitude,
      categories,
    } = data;
    const {
      id,
      name:prevName,
      latitude:prevLatitude,
      longitude:prevLongitude,


      photos:prevPhoto,


      wholeCategories:prevCategories
    } = seeCoffeeShopData.seeCoffeeShop
    const prevCategoryArr = prevCategories.map(categoryObj => categoryObj.name);
    let categoryArr:Array<string>|undefined;
    if(categories) {
      categoryArr = categories.split(" ")?.filter((word:string) => /#[\w|ㄱ-ㅎ|가-힣|ㅏ-ㅣ]+/g.test(word))
    }
    const isNameChanged = name === prevName;
    const isLatitudeChanged = latitude === prevLatitude;
    const isLongitudeChanged = longitude === prevLongitude;


    const isPhotoUrlChanged = photoUrl === prevPhoto[0]?.url;



    const isCategoriesChanged = JSON.stringify(categoryArr) === JSON.stringify(prevCategoryArr);
    if(isNameChanged && isLatitudeChanged && isLongitudeChanged &&
     
      
      isPhotoUrlChanged 
      
      
      && isCategoriesChanged) return;
    
    console.log(prevCategoryArr)

    const result = await editCoffeeShop({
      variables:{
        id,
        ...(!isNameChanged && { name: prevName }), 
        ...(!isLatitudeChanged && { latitude: prevLatitude }),
        ...(!isLongitudeChanged && { longitude: prevLongitude }),


        ...(!isPhotoUrlChanged && { deletePhotoIdArr: [ prevPhoto[0].id ] }),
        ...(!isPhotoUrlChanged && { addPhotoUrl: photoUrl }),


        ...(!isCategoriesChanged && {
          prevCategories: prevCategoryArr,
          categories: categories,
        })
      },
      update:(cache, result) => {
        const {data:{editCoffeeShop:{ok,addCategoryArr,deleteCategoryIds,addPhotoArr,deletePhotoIds}}} = result;
        if(ok && addCategoryArr || deleteCategoryIds || addPhotoArr || deletePhotoIds){
          addCategoryArr?.forEach(addCategoryObj => {
            // if(addCategoryObj?.id){
            const normalizedId = cache.identify({ id:addCategoryObj.id, __typename: 'Category' });
            console.log(normalizedId)
            const ref = cache.writeFragment({
              id: `Category:${addCategoryObj.id}`,
              fragment: gql`
                fragment MyTodo on Category {
                  id
                  name
                  slug
                }
              `,
              data: {
                id:addCategoryObj.id,
                name:addCategoryObj.name,
                slug:categories,
              },
            });
            console.log(ref)
            cache.modify({
              id:`CoffeeShop:${id}`,
              fields:{
                wholeCategories(prev){
                  return [...prev,ref]
                }
              }
            })
          });

          deleteCategoryIds?.forEach(id => {
            const normalizedId = cache.identify({ id, __typename: 'Category' });
            console.log(normalizedId)
            cache.evict({ id: normalizedId });
          });

          addPhotoArr?.forEach(addPhotoObj => {
            // if(addPhotoObj?.id){
            const normalizedId = cache.identify({ id:addPhotoObj.id, __typename: 'CoffeeShopPhoto' });
            console.log(normalizedId)
            const ref = cache.writeFragment({
              id: `CoffeeShopPhoto:${addPhotoObj.id}`,
              fragment: gql`
                fragment MyPhoto on CoffeeShopPhoto {
                  id
                  url
                }
              `,
              data: {
                id:addPhotoObj.id,
                url:addPhotoObj.url
              },
            });
            console.log(ref)
            cache.modify({
              id:`CoffeeShop:${id}`,
              fields:{
                photos(prev){
                  return [...prev,ref]
                }
              }
            })
          });

          deletePhotoIds?.forEach(id => {
            const normalizedId = cache.identify({ id, __typename: 'CoffeeShopPhoto' });
            console.log(normalizedId)
            cache.evict({ id: normalizedId });
          });

          cache.gc();
        }
      }
    })
    console.log(result);
    if(result.data.editCoffeeShop.ok) {
      history.push(urlLink.FEED)
    } else {
      setError("result", {message: result.data.editCoffeeShop.error})
    }
  }
}

export default editPostOnSubmit;