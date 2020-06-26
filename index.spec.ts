import { omit, omitBy } from 'lodash';
import { processFiles } from './index';
import { join } from 'path';

describe('Process files', () => {
    let omitMock: jasmine.Spy;
    let omitByMock: jasmine.Spy;
    let sync: jasmine.Spy;
    let writeFileSync: jasmine.Spy;
    let requireMock: jasmine.Spy;
    const omitMethods = {
        omit,
        omitBy,
    };

    beforeEach(() => {
        omitMock = jasmine.createSpy('omit');
        omitByMock = jasmine.createSpy('omitBy');
        sync = jasmine.createSpy('sync');
        writeFileSync = jasmine.createSpy('writeFileSync');
        requireMock = jasmine.createSpy('requireMock');
    });

    it('should throw an error if patterns are an empty array', () => {
        const cwd = '';
        expect(() => {
            processFiles([], false, requireMock, '', omitMock, omitByMock, sync, writeFileSync);
        }).toThrowError('No pattern has been provided. Please use --pattern xxxx to add at least one.');
    });

    it('should execute sync to fetch files if there is are patterns: one pattern', () => {
        const cwd = '';
        const pattern = 'pattern1';
        const patterns = [ pattern ];
        const expectedPackagePattern = pattern + `/package.json`;
        const files = [ 'file1', 'file2' ];
        sync.and.returnValue(files);

        processFiles(patterns, false, requireMock, cwd, omitMock, omitByMock, sync, writeFileSync);

        expect(sync).toHaveBeenCalledWith(expectedPackagePattern, { cwd });
    });

    it('should not add an extra package.json to path if it was provided in pattern', () => {
        const cwd = '';
        const pattern = 'pattern1/package.json';
        const patterns = [ pattern ];
        const files = [ 'file1', 'file2' ];
        sync.and.returnValue(files);

        processFiles(patterns, false, requireMock, cwd, omitMock, omitByMock, sync, writeFileSync);

        expect(sync).toHaveBeenCalledWith(pattern, { cwd });
    });

    it('should execute sync to fetch files if there is are patterns: two patterns', () => {
        const cwd = '';
        const pattern1 = 'pattern1';
        const pattern2 = 'pattern1';
        const patterns = [ pattern1, pattern2 ];
        const expectedPackagePattern1 = pattern1 + `/package.json`;
        const expectedPackagePattern2 = pattern2 + `/package.json`;
        const files = [ 'file1', 'file2' ];
        sync.and.returnValue(files);

        processFiles(patterns, false, requireMock, cwd, omitMock, omitByMock, sync, writeFileSync);

        expect(sync.calls.argsFor(0)[0]).toEqual(expectedPackagePattern1);
        expect(sync.calls.argsFor(0)[1]).toEqual({ cwd });
        expect(sync.calls.argsFor(1)[0]).toEqual(expectedPackagePattern2);
        expect(sync.calls.argsFor(1)[1]).toEqual({ cwd });
    });

    it('should execute only one console.log if verbose mode is off', () => {
        const cwd = '';
        spyOn(console, 'log');
        const pattern1 = 'pattern1';
        const patterns = [ pattern1 ];
        const files = [ 'file1' ];
        sync.and.returnValue(files);

        processFiles(patterns, false, requireMock, cwd, omitMock, omitByMock, sync, writeFileSync);

        expect(console.log).toHaveBeenCalledTimes(1);
    });

    it('should execute all the console.log if verbose mode is on', () => {
        const cwd = '';
        spyOn(console, 'log');
        const pattern1 = 'pattern1';
        const patterns = [ pattern1 ];
        const files = [ 'file1' ];
        sync.and.returnValue(files);

        processFiles(patterns, true, requireMock, cwd, omitMock, omitByMock, sync, writeFileSync);

        expect(console.log).toHaveBeenCalledTimes(11);
    });

    it('should requireMock two files if each pattern returns a file', () => {
        const cwd = '';
        const pattern1 = 'pattern1';
        const pattern2 = 'pattern2';
        const patterns = [ pattern1, pattern2 ];
        const filesPattern1 = [ 'file1' ];
        const filesPattern2 = [ 'file2' ];
        sync.and.returnValues(filesPattern1, filesPattern2);

        processFiles(patterns, true, requireMock, cwd, omitMock, omitByMock, sync, writeFileSync);

        expect(requireMock).toHaveBeenCalledTimes(2);
    });

    it('should strip out properties prefixed with underscore', () => {
        const cwd = '';
        const packageJsonPath = join(__dirname, '..', '/fixtures/fixture-lib/package.json');
        const strippedPackageJsonPath = join(__dirname, '..', '/fixtures/fixture-lib/stripped-underscore-package.json');
        const packageJson = require(packageJsonPath);
        const strippedPackageJson = require(strippedPackageJsonPath);

        const pattern1 = 'pattern1';
        const patterns = [ pattern1 ];
        const filesPattern1 = [ 'file1' ];
        const omitSpy = spyOn(omitMethods, 'omit').and.callThrough();
        const omitBySpy = spyOn(omitMethods, 'omitBy').and.callThrough();

        sync.and.returnValue(filesPattern1);
        requireMock.and.returnValue(packageJson);

        processFiles(patterns, false, requireMock, cwd, omitSpy, omitBySpy, sync, writeFileSync);

        expect(omitSpy.calls.argsFor(0)[0]).toEqual(strippedPackageJson);
    });

    it('should strip out properties prefixed with underscore as well as author, rights and publishConfig', () => {
        const cwd = '';
        const packageJsonPath = join(__dirname, '..', '/fixtures/fixture-lib/package.json');
        const completelyStrippedPackageJsonPath = join(__dirname, '..', '/fixtures/fixture-lib/completely-stripped-underscore-package copy.json');
        const packageJson = require(packageJsonPath);
        const completelyStrippedPackageJson = require(completelyStrippedPackageJsonPath);

        const pattern1 = 'pattern1';
        const patterns = [ pattern1 ];
        const filesPattern1 = [ 'file1' ];
        const stringify = spyOn(JSON, 'stringify').and.callThrough();

        sync.and.returnValue(filesPattern1);
        requireMock.and.returnValue(packageJson);

        processFiles(patterns, false, requireMock, cwd, omit, omitBy, sync, writeFileSync);

        expect(stringify.calls.argsFor(0)[0]).toEqual(completelyStrippedPackageJson);
    });

    it('should gracelly fail when file cannot be found or if it cannot be parsed: verbose set to true', () => {
        const cwd = '';
        const errorMessage = 'SyntaxError: path/package.json: Unexpected token < in JSON at position 2688';
        const expectedErrorMessage = 'file1 cannot be found or file has parsing issues.';

        const pattern1 = 'pattern1';
        const patterns = [ pattern1 ];
        const filesPattern1 = [ 'file1' ];
        const errorLogger = spyOn(console, 'error');

        sync.and.returnValue(filesPattern1);
        requireMock.and.throwError(errorMessage);

        processFiles(patterns, true, requireMock, cwd, omit, omitBy, sync, writeFileSync);

        expect(errorLogger).toHaveBeenCalledWith(expectedErrorMessage)
    })
});