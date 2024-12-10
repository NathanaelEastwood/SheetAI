function CreateData(intake: any[][], height: number, width: number): any[][]
{
    const result: any[][] = Array.from({ length: height }, () => Array(width).fill(null));
    return result
}