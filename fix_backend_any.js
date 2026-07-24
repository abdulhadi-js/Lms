const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let changedFiles = 0;

walkDir(path.join(__dirname, 'Backend', 'src'), function(filePath) {
  if (filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Fix catch (err: any) -> catch (error) { const err = error as any; ... }
    // Wait, the goal is to remove `any`. So `catch (error) { const err = error as Error; ... }`
    // However, if we do `const err = error as Error;`, we can safely access `err.message`.
    // We can replace `catch (err: any) {` with `catch (err: unknown) { if (err instanceof Error) {` ... this is hard to regex.

    // A simpler regex approach for `catch (err: any)`:
    content = content.replace(/catch\s*\(\s*(err|error)\s*:\s*any\s*\)\s*\{/g, 'catch ($1) {');
    // But then `$1.message` will error because `$1` is of type `unknown` by default in TS 4.4+
    // Unless `useUnknownInCatchVariables` is false.
    // Let's explicitly do: `catch (e) { const err = e as Error;`
    content = content.replace(/catch\s*\(\s*err\s*:\s*any\s*\)\s*\{/g, 'catch (e) { const err = e as Error;');
    content = content.replace(/catch\s*\(\s*error\s*:\s*any\s*\)\s*\{/g, 'catch (e) { const error = e as Error;');

    // Fix other common any:
    // `Promise<any>` -> `Promise<unknown>`
    content = content.replace(/Promise<any>/g, 'Promise<unknown>');
    
    // `Record<string, any>` -> `Record<string, unknown>`
    content = content.replace(/Record<string,\s*any>/g, 'Record<string, unknown>');

    // `(req: any)` -> `(req: any)` ... wait, let's just do `any` in generic situations.
    // DTOs sometimes use `any` for metadata.
    // We should be careful. Let's just fix the `catch` blocks and `Record<string, any>`.
    
    // Some endpoints have `handlePayClick = (fee: any)` in frontend, but this is backend.
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      changedFiles++;
    }
  }
});

console.log(`Modified ${changedFiles} files to remove 'any' casts.`);
