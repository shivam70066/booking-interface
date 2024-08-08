import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'amenitiesFilter',
  standalone: true
})
export class AmenitiesFilterPipe implements PipeTransform {

  transform(allRooms: any[], AmenitiesData: any[]): any {
    return allRooms.filter( it => {
      var aminityFlag = false;
    	if(AmenitiesData.length > 0){
        AmenitiesData.some((item) => {
          if(it.hasOwnProperty('amenitiesdata')){
            for(let value in it.amenitiesdata){
              for(let amenity in it.amenitiesdata[value]){
                if(it.amenitiesdata[value][amenity]['name'] === item){
                  aminityFlag = true;
                }
              }
            }
          }
        });
        if(aminityFlag){
          return true;
        } else {
          return false;
        }
      } else {
         return true;
      }
    })
  }
}
