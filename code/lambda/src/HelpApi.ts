import { DynamoDB } from "aws-sdk";
import { v4 } from 'uuid'; 

export class HelpApi
{
    async getItem<T>(key: any) : Promise<T>
    {
        try 
        {
            return (await new DynamoDB.DocumentClient(
            {
                region: process.env.region
            })
            .get(
            {
                TableName: process.env.database,
                Key: key
            })
            .promise())
            .Item as T;
        } 
        catch (error) 
        {
            console.log(error);

            return undefined;
        }        
    }

    async putItem<T>(item: any, conditionExpression: string) : Promise<boolean>
    {
        try 
        {
            await new DynamoDB.DocumentClient(
            { 
                region: process.env.region
            })
            .put(
            {
                TableName: process.env.database,
                Item: item,
                ConditionExpression: conditionExpression
            })
            .promise();

            return true;
        } 
        catch (error) 
        {
            console.log(error);
            
            return false;
        }  
    }

    async updateItem<T>(         
        key: any,
        expressionAttributeValues: any,
        expressionAttributeNames: any,
        updateExpression: string,
        conditionExpression: string)  : Promise<boolean>
    {
        try 
        {
            await new DynamoDB.DocumentClient(
            {
                region: process.env.region
            })
            .update(
            {
                TableName: process.env.database, 
                Key: key,
                ExpressionAttributeNames: expressionAttributeNames,
                ExpressionAttributeValues: expressionAttributeValues,
                UpdateExpression: updateExpression,
                ConditionExpression: conditionExpression
            })
            .promise(); 

            return true;
        } 
        catch (error) 
        {
            console.log(error);

            return false;
        } 
    }

    async deleteItem<T>(key: any, conditionExpression: string) : Promise<boolean>
    {
        try 
        {
            await new DynamoDB.DocumentClient().delete(
            {
                TableName: process.env.database,            
                Key: key,            
                ConditionExpression: conditionExpression
            })
            .promise();   

            return true;
        } 
        catch (error) 
        {
            console.log(error);
            
            return false;
        }        
    }

    async query<T>(
        indexName: string, 
        keyConditionExpression: string,
        expressionAttributeNames: any,
        expressionAttributeValues: any) : Promise<T>
    {
        try 
        {
            return (await new DynamoDB.DocumentClient().query(
            {
                TableName : process.env.database,
                IndexName: indexName,
                KeyConditionExpression: keyConditionExpression,
                ExpressionAttributeValues: expressionAttributeValues,
                ExpressionAttributeNames: expressionAttributeNames
            })
            .promise())
            .Items as T;    
        } 
        catch (error) 
        {
            console.log(error);

            return undefined;
        }
    }

    getUuid(): string
    {
        return v4();
    }

    getObjectValue(obj: any, path: string) : any | undefined 
    {
        const keys = path.split('.');
        let currentObj = obj;
        let foundValue: any | undefined;
    
        keys.forEach(key => 
        {
            if (!currentObj || typeof currentObj !== 'object') 
            {
                foundValue = undefined;
                return;
            }

            currentObj = currentObj[key];
            foundValue = currentObj;
        });
    
        return foundValue;
    }    

    setObjectValue(obj: any, path: string, value: any) 
    {
        const keys = path.split('.');
        let currentObj = obj;
    
        keys.slice(0, -1).forEach(x => 
        {
            if (!currentObj[x]) currentObj[x] = {};
            
            currentObj = currentObj[x];
        });
    
        currentObj[keys[keys.length - 1]] = value;
    }

    createRegexPattern(prefix: string): RegExp 
    {
        return new RegExp(`^\\/${prefix}$`);
    }

    createRegexPattern2p(prefix: string): RegExp 
    {
        return new RegExp(`^\\/${prefix}\\/[\\w-]+$`);
    }

    createRegexPattern3p(prefix1: string, prefix2: string): RegExp 
    {
        return new RegExp(`^\\/${prefix1}\\/[\\w-]+\\/${prefix2}$`);
    }

    async describeTable() : Promise<{ 
        AttributeDefinitions: 
        {
            AttributeName: string
            AttributeType: string
        }[]
        KeySchema: 
        {
            AttributeName: string
            KeyType: string
        }[]
        GlobalSecondaryIndexes: 
        {
            IndexName: string
            KeySchema: 
            {
                AttributeName: string
                KeyType: string
            }[]
        }[]
    }>
    {
        var described : 
        { 
            Table:
            { 
                AttributeDefinitions: 
                {
                    AttributeName: string
                    AttributeType: string
                }[]
                KeySchema: 
                {
                    AttributeName: string
                    KeyType: string
                }[]
                GlobalSecondaryIndexes: 
                {
                    IndexName: string
                    KeySchema: 
                    {
                        AttributeName: string
                        KeyType: string
                    }[]
                }[]
            }
        } = (await new DynamoDB(
        {
            region: process.env.region
        })
        .describeTable(
        {
            TableName: process.env.database
        })
        .promise()) as any;

        return described.Table;
    }

    splitRoute(route: string) : string[]
    {
        var temp = route;

        if(route.startsWith('/')) temp = route.substring(1);        

        return temp.split('/').filter(x => x !== '');
    }

    async executeSequentially(functions: (() => Promise<boolean>)[]) : Promise<boolean>
    { 
        return functions.reduce((promiseChain, func) => 
        {
            return promiseChain.then(result => 
            {
                if (result === false) return false; 
            
                return func();
            });
        }, Promise.resolve(true));
    }   

    async promisify(x: any, data: any, source: any, other: any) : Promise<boolean>
    {    
        return new Promise(async (resolve, reject) => 
        { 
            try 
            { 
                resolve(await x.run(data, source, other));                
            } 
            catch (error) 
            {
                reject(error); 
            }
        });
    }

    searchForArray(array: any[], val: any) : boolean
    {
        for (let i = 0; i < array.length; i++) 
        {            
            if(JSON.stringify(array[i]) === JSON.stringify(val)) return true;
        }
        
        return false;
    }

    extractNumbersFromUUID(uuid: string) : number
    {
        return Number.parseInt(uuid.match(/\d/g).join(''));
    }

    selectMany<T, K>(input: T[], selectListFn: (t: T) => K[]): K[] 
    {
        return input.reduce((out, inx) => 
        {
            out.push(...selectListFn(inx));
            return out;
        }, 
        new Array<K>());
    }

    prefixVars(data: any, command: string)
    { 
        command = command.replace(/\.\.\.(\w+)/g, (match, p1) => 
        {
            if (data.hasOwnProperty(p1)) return `...data.${p1}`;
           
            return match;
        });
     
        return command.replace(/\b([a-zA-Z_]\w*)\b/g, (match, p1, offset, string) => 
        { 
            if (((token) => /\b\w+\s*\(/.test(token))(match)) return match;
     
            const precedingChar = string[offset - 1];
            const followingChar = string[offset + match.length];
    
            const isWithinQuotes = 
                (precedingChar === '"' || precedingChar === "'" || precedingChar === '`') && 
                (followingChar === '"' || followingChar === "'" || followingChar === '`');
    
            const isKeyInObject = 
                precedingChar === ':' && 
                (followingChar === ',' || followingChar === '}' || followingChar === undefined);
     
            if (data.hasOwnProperty(match) && !isWithinQuotes && !(precedingChar === '.' || isKeyInObject)) return `data.${match}`;
           
            return match;
        });
    } 

    joinArrays(
        array1: any[],
        array2: any[],
        joinType: 'INNER' | 'LEFT' | 'RIGHT' | 'OUTER' = 'INNER',
        matchFn: (item1: any, item2: any) => boolean, 
        mapFn: (item1: any, item2: any | undefined) => any): any[] 
        {
            let joinedArray: any[] = [];
    
            if (joinType === 'INNER') 
            {
                joinedArray = array1.map(i1 => 
                {
                    const i2 = array2.find(item2 => matchFn(i1, item2));
                    return i2 ? mapFn(i1, i2) : undefined;
                })
                .filter(i => i !== undefined);
            } 
            else if (joinType === 'LEFT') 
            {
                joinedArray = array1.map(i1 => mapFn(i1, array2.find(i2 => matchFn(i1, i2))));
            } 
            else if (joinType === 'RIGHT') 
            {
                joinedArray = array2.map(i2 => mapFn(array1.find(i1 => matchFn(i1, i2)) || {}, i2));
            } 
            else if (joinType === 'OUTER') 
            { 
                joinedArray = [
                    ...array1
                        .map(i1 => mapFn(i1, array2.find(i2 => matchFn(i1, i2)))), 
                    ...array2
                        .filter(i2 => !array1.some(i1 => matchFn(i1, i2)))
                        .map(i2 => mapFn({}, i2))
                ];
            }
    
            return joinedArray;
        }
}
